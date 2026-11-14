/*
  ========================================================================
  Smart Plant Water Management & Living Environment - Wokwi ESP32 Sketch
  EVS IoT Circuit Code with LCD, Rain Sensor, Red LED & Alarm Buzzer
  ========================================================================
  Hardware Components:
  1. ESP32 Microcontroller
  2. DHT11 Sensor (Pin 15) -> Temperature & Air Humidity
  3. Potentiometer (Pin 34) -> Simulates YL-69 Soil Moisture Sensor (0 - 100%)
  4. LDR Photoresistor (Pin 35) -> Simulates Sunlight Lux Sensor
  5. Push Button / FC-37 Rain Drop Sensor (Pin 14) -> Rain Drop Detection
  6. 5V Relay / DC Water Pump (Pin 26) -> Automated Irrigation Pump
  7. Red Alert LED (Pin 12) -> Visual Rain Alarm Signal
  8. Piezo Alarm Buzzer (Pin 27) -> Acoustic Rain Alert Warning
  9. I2C LCD Screen (SDA: Pin 21, SCL: Pin 22) -> Hardware Display Screen
  ========================================================================
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <DHT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Pin Definitions
#define DHTPIN 15
#define DHTTYPE DHT11
#define SOIL_POT_PIN 34
#define LDR_PIN 35
#define RAIN_BTN_PIN 14
#define RELAY_PUMP_PIN 26
#define RAIN_LED_PIN 12
#define BUZZER_PIN 27

// Network Configuration for Wokwi Simulator
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// LocalTunnel Endpoint
const char* serverUrl = "https://bitter-places-give.loca.lt/api/sensors";

DHT dht(DHTPIN, DHTTYPE);
// 16x2 LCD Display at I2C address 0x27
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Target Thresholds
int targetMoistureThreshold = 50; 
bool isAutoMode = true;

void setup() {
  Serial.begin(115200);
  Serial.println("\n🌱 Initializing Smart Plant IoT Controller...");

  pinMode(RAIN_BTN_PIN, INPUT_PULLUP);
  pinMode(RELAY_PUMP_PIN, OUTPUT);
  pinMode(RAIN_LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(RELAY_PUMP_PIN, LOW); // Pump OFF initially
  digitalWrite(RAIN_LED_PIN, LOW);   // Red Alert LED OFF initially
  noTone(BUZZER_PIN);

  dht.begin();
  
  // Initialize I2C Bus for LCD on Pins 21 (SDA) and 22 (SCL)
  Wire.begin(21, 22);
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("SmartPlant Eco");
  lcd.setCursor(0, 1);
  lcd.print("EVS Controller");
  delay(1500);
  lcd.clear();

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Wi-Fi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // 1. Read Sensors
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Handle DHT failure fallback
  if (isnan(temperature)) temperature = 25.0;
  if (isnan(humidity)) humidity = 60.0;

  // Read Soil Moisture Potentiometer (ADC: 0 to 4095 mapped to 0% to 100%)
  int rawSoil = analogRead(SOIL_POT_PIN);
  int soilMoisture = map(rawSoil, 0, 4095, 0, 100);

  // Read LDR Sunlight Lux (0 to 4095 mapped to 0 to 1000 Lux)
  int rawLdr = analogRead(LDR_PIN);
  int lightLux = map(rawLdr, 0, 4095, 0, 1000);

  // Read Rain Drop Sensor Button (LOW = Raining/Triggered, HIGH = Dry)
  bool btnRain = (digitalRead(RAIN_BTN_PIN) == LOW);

  // Rain Alert Logic:
  // Triggers alert only when Soil Moisture > 90% AND Temperature < 20°C (OR push button is pressed)
  bool rainDetected = ((soilMoisture > 90) && (temperature < 20.0)) || btnRain;
  bool environmentalAlert = soilMoisture >= 100 && temperature < 15.0 && humidity > 80.0;
  bool buzzerAlert = rainDetected || environmentalAlert;

  // 2. Closed-Loop Automated Irrigation Control & Rain Alert Logic
  bool pumpState = false;
  if (rainDetected) {
    // Rain alert turns on the red LED and locks the pump.
    digitalWrite(RAIN_LED_PIN, HIGH);

    // Safety Lock: Immediately Stop Pump to prevent waterlogging
    pumpState = false;
    digitalWrite(RELAY_PUMP_PIN, LOW);
  } else {
    digitalWrite(RAIN_LED_PIN, LOW);

    // Auto-Irrigation logic
    if (isAutoMode && soilMoisture < targetMoistureThreshold) {
      pumpState = true; // Soil is dry -> Turn ON Pump
      digitalWrite(RELAY_PUMP_PIN, HIGH);
    } else {
      pumpState = false;
      digitalWrite(RELAY_PUMP_PIN, LOW);
    }
  }

  if (buzzerAlert) {
    tone(BUZZER_PIN, 1000);
  } else {
    noTone(BUZZER_PIN);
  }

  // 3. Update Hardware LCD Display (Line 0 & Line 1)
  lcd.setCursor(0, 0);
  lcd.print("SM:"); lcd.print(soilMoisture); lcd.print("% ");
  if (rainDetected) {
    lcd.print("RAIN! 🌧️");
  } else {
    lcd.print("T:"); lcd.print((int)temperature); lcd.print("C  ");
  }

  lcd.setCursor(0, 1);
  if (rainDetected) {
    lcd.print("PUMP:LOCKED [ALERT]");
  } else {
    lcd.print("PUMP:"); lcd.print(pumpState ? "ON [PUMPING]" : "OFF [IDLE] ");
  }

  // 4. Print Serial Diagnostics
  Serial.printf("[IOT SENSORS] Moisture: %d%% | Temp: %.1fC | Hum: %.1f%% | Lux: %d | Rain: %s | Env Alert: %s | Buzzer: %s | Pump: %s\n",
    soilMoisture, temperature, humidity, lightLux, rainDetected ? "YES (ALERT!)" : "NO",
    environmentalAlert ? "YES" : "NO", buzzerAlert ? "ON" : "OFF", pumpState ? "ON" : "OFF");

  // 5. Send Telemetry Payload to Web App API Endpoint
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure secureClient;
    secureClient.setInsecure(); // Skip SSL certificate verification in Wokwi simulator

    String jsonPayload = "{";
    jsonPayload += "\"soilMoisture\":" + String(soilMoisture) + ",";
    jsonPayload += "\"temperature\":" + String(temperature) + ",";
    jsonPayload += "\"humidity\":" + String(humidity) + ",";
    jsonPayload += "\"light\":" + String(lightLux) + ",";
    jsonPayload += "\"rainDetected\":" + String(rainDetected ? "true" : "false");
    jsonPayload += "}";

    HTTPClient http;
    http.setTimeout(15000);
    http.begin(secureClient, String(serverUrl));
    http.addHeader("Content-Type", "application/json");
    http.addHeader("User-Agent", "ESP32-SmartPlant/1.0");
    http.addHeader("Bypass-Tunnel-Reminder", "true");
    int httpResponseCode = http.POST(jsonPayload);
    if (httpResponseCode == 307 || httpResponseCode == 301 || httpResponseCode == 302) {
      String location = http.getLocation();
      http.end();
      if (location.length() > 0) {
        http.begin(secureClient, location);
        http.addHeader("Content-Type", "application/json");
        http.addHeader("User-Agent", "ESP32-SmartPlant/1.0");
        http.addHeader("Bypass-Tunnel-Reminder", "true");
        httpResponseCode = http.POST(jsonPayload);
      }
    }

    if (httpResponseCode == 200 || httpResponseCode == 201) {
      Serial.printf("[HTTP POST] Code: %d (SUCCESS!)\n", httpResponseCode);
    } else if (httpResponseCode < 0) {
      Serial.printf("[HTTP POST] FAILED: %s\n", http.errorToString(httpResponseCode).c_str());
    } else {
      Serial.printf("[HTTP POST] Unexpected code: %d\n", httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("[WIFI] Not connected, skipping HTTP POST");
  }

  delay(1000); // 1 second telemetry cycle (more stable than 500ms)
}

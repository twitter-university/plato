package com.marakana.android.sensors;

import android.app.Activity;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.PowerManager;
import android.os.PowerManager.WakeLock;
import android.widget.TextView;

public class SensorsDemoActivity extends Activity implements
		SensorEventListener {
	private SensorManager sensorManager;
	private Sensor sensor;
	private PowerManager powerManager;
	private WakeLock wakeLock;
	private TextView out;
	private CompassView rose;

	/** Called when the activity is first created. <1>*/
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		// Setup the UI <2+3>
		setContentView(R.layout.main);
		out = (TextView) findViewById(R.id.out);
		rose = (CompassView) findViewById(R.id.rose);

		// Setup Sensor Manager <2+2>
		sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE); // <3>
		sensor = sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION);
		
		// Setup Power Manager to keep screen on
		powerManager = (PowerManager) getSystemService(POWER_SERVICE);
		wakeLock = powerManager.newWakeLock(PowerManager.SCREEN_DIM_WAKE_LOCK, "Compass");
	}

	@Override
	protected void onResume() {
		super.onResume();
		sensorManager.registerListener(this, sensor,
				SensorManager.SENSOR_DELAY_UI);
		wakeLock.acquire();
	}

	@Override
	protected void onPause() {
		super.onPause();
		sensorManager.unregisterListener(this);
		wakeLock.release();
	}

	// --- Sensor Manager Callbacks ---
	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {
	}

	@Override
	public void onSensorChanged(SensorEvent event) {
		rose.setDegrees(event.values[0]);
		out.setText(String.format("Azimuth: %3.0f \nPitch: %3.0f \nRoll: %3.0f",
				event.values[0], event.values[1], event.values[2]));
	}

}
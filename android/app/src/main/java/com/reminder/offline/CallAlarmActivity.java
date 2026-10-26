package com.reminder.offline;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;
import androidx.core.content.ContextCompat;

public class CallAlarmActivity extends Activity {

    private Ringtone ringtone;
    private Vibrator vibrator;
    private String phoneNumber = "";
    private String contactName = "";
    private String title = "";
    private int alarmId = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Turn on screen and show over lockscreen
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            );
        }
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        setContentView(R.layout.activity_call_alarm);

        // Extract Intent Data
        Intent intent = getIntent();
        if (intent != null) {
            phoneNumber = intent.getStringExtra("phoneNumber") != null ? intent.getStringExtra("phoneNumber") : "";
            contactName = intent.getStringExtra("contactName") != null ? intent.getStringExtra("contactName") : "Contact";
            title = intent.getStringExtra("title") != null ? intent.getStringExtra("title") : "Scheduled Call";
            alarmId = intent.getIntExtra("alarmId", 0);
            boolean isBirthday = intent.getBooleanExtra("isBirthday", false);
            int ageMilestone = intent.getIntExtra("ageMilestone", 0);

            // Bind Views
            TextView tvName = findViewById(R.id.alarm_contact_name);
            TextView tvNumber = findViewById(R.id.alarm_phone_number);
            TextView tvDesc = findViewById(R.id.alarm_description);
            TextView tvAvatar = findViewById(R.id.alarm_avatar_letter);
            TextView tvBadge = findViewById(R.id.alarm_type_badge);
            TextView tvMilestone = findViewById(R.id.alarm_milestone);

            tvName.setText(contactName);
            tvNumber.setText(phoneNumber);
            tvDesc.setText(title);

            if (!contactName.isEmpty()) {
                tvAvatar.setText(String.valueOf(contactName.charAt(0)).toUpperCase());
            }

            if (isBirthday) {
                tvBadge.setText("🎉 ANNUAL BIRTHDAY CALL");
                if (ageMilestone > 0) {
                    tvMilestone.setVisibility(View.VISIBLE);
                    tvMilestone.setText("Turning " + ageMilestone + " Today! 🎂");
                }
            }
        }

        startAlarmSoundAndVibration();

        // Button Listeners
        Button btnCall = findViewById(R.id.btn_accept_call);
        Button btnSnooze = findViewById(R.id.btn_snooze_call);
        Button btnDismiss = findViewById(R.id.btn_dismiss_call);

        btnCall.setOnClickListener(v -> executePhoneCall());
        btnSnooze.setOnClickListener(v -> executeSnooze());
        btnDismiss.setOnClickListener(v -> executeDismiss());
    }

    private void startAlarmSoundAndVibration() {
        try {
            Uri alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (alarmUri == null) {
                alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
            }
            ringtone = RingtoneManager.getRingtone(getApplicationContext(), alarmUri);
            if (ringtone != null) {
                ringtone.play();
            }

            vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null && vibrator.hasVibrator()) {
                long[] pattern = {0, 600, 300, 600, 1500};
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(VibrationEffect.createWaveform(pattern, 0));
                } else {
                    vibrator.vibrate(pattern, 0);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void stopSoundAndVibration() {
        if (ringtone != null && ringtone.isPlaying()) {
            ringtone.stop();
        }
        if (vibrator != null) {
            vibrator.cancel();
        }
    }

    private void executePhoneCall() {
        stopSoundAndVibration();

        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            Intent callIntent;
            // Check direct CALL_PHONE permission
            if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.CALL_PHONE)
                    == PackageManager.PERMISSION_GRANTED) {
                callIntent = new Intent(Intent.ACTION_CALL);
            } else {
                callIntent = new Intent(Intent.ACTION_DIAL);
            }

            callIntent.setData(Uri.parse("tel:" + phoneNumber.trim()));
            callIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(callIntent);
        }

        finish();
    }

    private void executeSnooze() {
        stopSoundAndVibration();

        // Reschedule for +10 minutes
        AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        if (alarmManager != null) {
            Intent intent = new Intent(this, AlarmReceiver.class);
            intent.putExtra("phoneNumber", phoneNumber);
            intent.putExtra("contactName", contactName);
            intent.putExtra("title", title + " (Snoozed)");
            intent.putExtra("alarmId", alarmId);

            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                this,
                alarmId + 9999,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            long triggerAt = System.currentTimeMillis() + (10 * 60 * 1000);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent);
            } else {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent);
            }
        }

        finish();
    }

    private void executeDismiss() {
        stopSoundAndVibration();
        finish();
    }

    @Override
    protected void onDestroy() {
        stopSoundAndVibration();
        super.onDestroy();
    }
}

package com.reminder.offline;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

public class AlarmReceiver extends BroadcastReceiver {

    public static final String CHANNEL_ID = "call_reminder_channel";

    @Override
    public void onReceive(Context context, Intent intent) {
        // Acquire WakeLock to keep CPU alive while presenting alarm
        PowerManager powerManager = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = null;
        if (powerManager != null) {
            wakeLock = powerManager.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP,
                "ReminderApp:AlarmWakeLock"
            );
            wakeLock.acquire(15000); // 15 seconds max
        }

        String phoneNumber = intent.getStringExtra("phoneNumber") != null ? intent.getStringExtra("phoneNumber") : "";
        String contactName = intent.getStringExtra("contactName") != null ? intent.getStringExtra("contactName") : "Contact";
        String title = intent.getStringExtra("title") != null ? intent.getStringExtra("title") : "Scheduled Call";
        int alarmId = intent.getIntExtra("alarmId", (int) System.currentTimeMillis());
        boolean isBirthday = intent.getBooleanExtra("isBirthday", false);
        int ageMilestone = intent.getIntExtra("ageMilestone", 0);

        // Intent to launch Full Screen CallAlarmActivity
        Intent fullScreenIntent = new Intent(context, CallAlarmActivity.class);
        fullScreenIntent.putExtra("phoneNumber", phoneNumber);
        fullScreenIntent.putExtra("contactName", contactName);
        fullScreenIntent.putExtra("title", title);
        fullScreenIntent.putExtra("alarmId", alarmId);
        fullScreenIntent.putExtra("isBirthday", isBirthday);
        fullScreenIntent.putExtra("ageMilestone", ageMilestone);
        fullScreenIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

        PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(
            context,
            alarmId,
            fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // Build Action Intent for Direct Call from notification bar
        Intent directCallIntent;
        if (ContextCompat.checkSelfPermission(context, android.Manifest.permission.CALL_PHONE)
                == PackageManager.PERMISSION_GRANTED) {
            directCallIntent = new Intent(Intent.ACTION_CALL);
        } else {
            directCallIntent = new Intent(Intent.ACTION_DIAL);
        }
        directCallIntent.setData(Uri.parse("tel:" + phoneNumber));
        directCallIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        PendingIntent callPendingIntent = PendingIntent.getActivity(
            context,
            alarmId + 100,
            directCallIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (notificationManager != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Call Reminders & Birthday Alarms",
                    NotificationManager.IMPORTANCE_HIGH
                );
                channel.setDescription("High priority incoming call reminders");
                channel.enableVibration(true);
                channel.setBypassDnd(true);
                notificationManager.createNotificationChannel(channel);
            }

            String contentText = isBirthday ? "🎂 Birthday today! Tap to call " + contactName : "Scheduled call to " + phoneNumber;

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_sys_phone_call)
                .setContentTitle(isBirthday ? "Call " + contactName + " - Birthday!" : "Time to call " + contactName)
                .setContentText(contentText)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setAutoCancel(true)
                .setFullScreenIntent(fullScreenPendingIntent, true)
                .setContentIntent(fullScreenPendingIntent)
                .addAction(android.R.drawable.sym_action_call, "Call Now", callPendingIntent);

            notificationManager.notify(alarmId, builder.build());
        }

        // Start Activity directly for immediate lockscreen display
        try {
            context.startActivity(fullScreenIntent);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
    }
}

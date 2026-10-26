package com.reminder.offline;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

@CapacitorPlugin(
    name = "CallReminder",
    permissions = {
        @Permission(strings = { android.Manifest.permission.CALL_PHONE }, alias = "callPhone"),
        @Permission(strings = { android.Manifest.permission.READ_CONTACTS }, alias = "contacts"),
        @Permission(strings = { "android.permission.POST_NOTIFICATIONS" }, alias = "notifications")
    }
)
public class CallReminderPlugin extends Plugin {

    @PluginMethod
    public void scheduleCallAlarm(PluginCall call) {
        String idStr = call.getString("id", String.valueOf(System.currentTimeMillis()));
        Long timestamp = call.getLong("timestamp");
        String phoneNumber = call.getString("phoneNumber", "");
        String contactName = call.getString("contactName", "Contact");
        String title = call.getString("title", "Call Reminder");
        Boolean isBirthday = call.getBoolean("isBirthday", false);
        Integer ageMilestone = call.getInt("ageMilestone", 0);

        if (timestamp == null || timestamp <= System.currentTimeMillis()) {
            call.reject("Timestamp must be in the future");
            return;
        }

        Context context = getContext();
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            call.reject("AlarmManager unavailable");
            return;
        }

        int alarmId = Math.abs(idStr.hashCode());

        Intent intent = new Intent(context, AlarmReceiver.class);
        intent.putExtra("phoneNumber", phoneNumber);
        intent.putExtra("contactName", contactName);
        intent.putExtra("title", title);
        intent.putExtra("alarmId", alarmId);
        intent.putExtra("isBirthday", isBirthday != null && isBirthday);
        intent.putExtra("ageMilestone", ageMilestone != null ? ageMilestone : 0);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            context,
            alarmId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, timestamp, pendingIntent);
        } else {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, timestamp, pendingIntent);
        }

        JSObject ret = new JSObject();
        ret.put("scheduled", true);
        ret.put("alarmId", alarmId);
        call.resolve(ret);
    }

    @PluginMethod
    public void cancelCallAlarm(PluginCall call) {
        String idStr = call.getString("id");
        if (idStr == null) {
            call.reject("Must provide reminder id");
            return;
        }

        Context context = getContext();
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager != null) {
            int alarmId = Math.abs(idStr.hashCode());
            Intent intent = new Intent(context, AlarmReceiver.class);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                alarmId,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            alarmManager.cancel(pendingIntent);
        }

        JSObject ret = new JSObject();
        ret.put("cancelled", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void directDial(PluginCall call) {
        String phoneNumber = call.getString("phoneNumber");
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            call.reject("Phone number is required");
            return;
        }

        Context context = getContext();
        Intent callIntent;

        if (ContextCompat.checkSelfPermission(context, android.Manifest.permission.CALL_PHONE)
                == PackageManager.PERMISSION_GRANTED) {
            callIntent = new Intent(Intent.ACTION_CALL);
        } else {
            callIntent = new Intent(Intent.ACTION_DIAL);
        }

        callIntent.setData(Uri.parse("tel:" + phoneNumber.trim()));
        callIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(callIntent);

        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }
}

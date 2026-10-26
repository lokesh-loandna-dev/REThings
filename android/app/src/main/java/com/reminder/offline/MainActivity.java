package com.reminder.offline;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CallReminderPlugin.class);
        super.onCreate(savedInstanceState);
    }
}

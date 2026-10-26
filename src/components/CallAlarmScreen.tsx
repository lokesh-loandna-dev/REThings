import { useEffect, useState } from 'react';
import { PhoneCall, PhoneOff, Clock, Cake } from 'lucide-react';
import { ringtone } from '../utils/audio';
import { initiatePhoneCall } from '../utils/telephony';

export interface AlarmTargetData {
  title: string;
  contactName: string;
  phoneNumber: string;
  isBirthday?: boolean;
  ageMilestone?: number;
}

interface CallAlarmScreenProps {
  alarmData: AlarmTargetData;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
}

export default function CallAlarmScreen({ alarmData, onDismiss, onSnooze }: CallAlarmScreenProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    // Start synthetic ringtone and vibration
    ringtone.startRingtone();

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      ringtone.stopRingtone();
    };
  }, []);

  const handleAcceptCall = () => {
    ringtone.stopRingtone();
    initiatePhoneCall(alarmData.phoneNumber);
    onDismiss();
  };

  const handleSnooze = () => {
    ringtone.stopRingtone();
    onSnooze(10);
  };

  const handleDismiss = () => {
    ringtone.stopRingtone();
    onDismiss();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#07090B',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'calc(30px + var(--safe-top)) 24px calc(36px + var(--safe-bottom)) 24px',
        animation: 'fadeIn 0.2s ease',
        textAlign: 'center'
      }}
    >
      {/* Top Banner */}
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: alarmData.isBirthday ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: alarmData.isBirthday ? '#F59E0B' : '#10B981',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {alarmData.isBirthday ? <Cake size={14} /> : <PhoneCall size={14} />}
          {alarmData.isBirthday ? 'Birthday Morning Call' : 'Scheduled Call Alarm'}
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 8 }} className="tabular-nums">
          Ringing... {secondsElapsed}s
        </div>
      </div>

      {/* Middle Contact & Milestone Block */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Pulsing Avatar Container */}
        <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 24 }}>
          <div
            style={{
              position: 'absolute',
              inset: -15,
              borderRadius: '50%',
              border: `2px solid ${alarmData.isBirthday ? '#F59E0B' : '#10B981'}`,
              opacity: 0.35,
              animation: 'pulseRing 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: -30,
              borderRadius: '50%',
              border: `1px solid ${alarmData.isBirthday ? '#F59E0B' : '#10B981'}`,
              opacity: 0.18,
              animation: 'pulseRing 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
              animationDelay: '0.4s'
            }}
          />
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: alarmData.isBirthday ? '#F59E0B' : '#10B981',
              color: '#07090B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 800,
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.25)'
            }}
          >
            {alarmData.contactName.charAt(0).toUpperCase()}
          </div>
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.02em', marginBottom: 4 }}>
          {alarmData.contactName}
        </h2>

        {alarmData.isBirthday && alarmData.ageMilestone && (
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#F59E0B',
              marginBottom: 6
            }}
          >
            🎂 Turning {alarmData.ageMilestone} Today!
          </div>
        )}

        <div style={{ fontSize: '1.1rem', color: '#94A3B8', fontWeight: 500 }} className="tabular-nums">
          {alarmData.phoneNumber}
        </div>

        <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: 10, maxWidth: 280 }}>
          {alarmData.title}
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div>
        {/* Main Swipe / Direct Call Button */}
        <button
          onClick={handleAcceptCall}
          style={{
            width: '100%',
            background: '#10B981',
            color: '#07090B',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '18px 24px',
            fontSize: '1.1rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(16, 185, 129, 0.4)',
            marginBottom: 16,
            transition: 'transform 0.15s ease'
          }}
        >
          <PhoneCall size={22} />
          Call {alarmData.contactName} Now
        </button>

        {/* Secondary Snooze & Dismiss Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button
            onClick={handleSnooze}
            style={{
              background: '#14171C',
              border: '1px solid #222731',
              color: '#F59E0B',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <Clock size={16} />
            Snooze 10m
          </button>

          <button
            onClick={handleDismiss}
            style={{
              background: '#14171C',
              border: '1px solid #222731',
              color: '#EF4444',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <PhoneOff size={16} />
            Dismiss
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.15; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

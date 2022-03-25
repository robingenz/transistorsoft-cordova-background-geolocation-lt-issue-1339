import { Component, NgZone, OnInit } from '@angular/core';
import BackgroundGeolocation, {
  Config,
} from '@transistorsoft/capacitor-background-geolocation';

interface Log {
  text: string;
  timestamp: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public logs: Log[] = [{
    text: '----',
    timestamp: new Date().toISOString()
  }];

  constructor(private readonly ngZone: NgZone) {}

  ngOnInit(): void {
    this.init();
  }

  async init(): Promise<void> {
    const config: Config = {
      activityType: 1,
      allowIdenticalLocations: false,
      backgroundPermissionRationale: {
        title:
          'Erlauben Sie ENGINE4 auf den Standort dieses Geräts zuzugreifen',
        message:
          // eslint-disable-next-line max-len
          'Diese App sammelt Standortdaten, um ihre Kundenfahrten aufzeichnen und die zurückgelegte Strecke berechnen zu können, auch wenn die App geschlossen oder nicht in Gebrauch ist. Bitte erlauben Sie der App hierfür, Ihren Standort die ganze Zeit über zu verwenden.',
      },
      debug: false,
      desiredAccuracy: -1,
      disableElasticity: true,
      distanceFilter: 0,
      fastestLocationUpdateInterval: 30000,
      foregroundService: true,
      geofenceModeHighAccuracy: true,
      heartbeatInterval: 600,
      locationAuthorizationRequest: 'Any',
      locationUpdateInterval: 30000,
      maxDaysToPersist: 1,
      maxRecordsToPersist: 10,
      notification: {
        title: 'ENGINE4',
        text: 'App läuft im Hintergrund und übermittelt Ihre Position',
        color: '#FFFFFF',
        channelName: 'Geolocation',
        priority: -1,
      },
      preventSuspend: true,
      startOnBoot: false,
      stationaryRadius: 25,
      stopOnTerminate: false,
      useSignificantChangesOnly: true,
    };

    BackgroundGeolocation.onLocation(location => {
      this.ngZone.run(() => {
        if (location.sample) {
          return;
        }
        const log: Log = {
          text: '' + location.coords.latitude + ' / ' + location.coords.longitude,
          timestamp: new Date().toISOString()
        };
        this.logs = [log, ...this.logs];
        console.log('log', { log });
      });
    });

    await BackgroundGeolocation.ready(config).then(state => {
      console.log('ready', { state });
      BackgroundGeolocation.start().then(state2 => {
        console.log('start', { state: state2 });
      });
    });
  }
}

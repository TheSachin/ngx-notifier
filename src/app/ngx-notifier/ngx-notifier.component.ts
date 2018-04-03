import { Component, Input } from '@angular/core';

import { INotification } from './others/notification-helper';

import { NgxNotifierService } from './services/ngx-notifier.service';

/**
 * Notifier compoent, which holds all the notifications can be accessed via `app-ngx-notifier` selector
 */
@Component({
  selector: 'app-ngx-notifier',
  templateUrl: './ngx-notifier.component.html',
  styleUrls: ['./ngx-notifier.component.scss']
})

export class NgxNotifierComponent {

  /** whether to allow duplicate messages or not */
  @Input() allowDuplicates = true;
  /** custom class to be attached */
  @Input() className: string;
  /** default duration for dismissing notifications (60s/1minute) */
  @Input() duration = 60000;
  /** click to dismiss a notification */
  @Input() dismissOnClick = false;
  /** Maximum number of notifications to keep */
  @Input() max = 5;

  /** array of notifications */
  notifications: INotification[] = [];

  /**
   * NgxNotifierComponent Constructor
   *
   * @param _ngxNotifierService Notifier Service
   */
  constructor(private _ngxNotifierService: NgxNotifierService) {
    this._ngxNotifierService.notification.subscribe((notification: INotification) => {
      this.updateNotifications(notification);
    });
  }

  /**
   * updates notification into the array i.e., Which is the display
   *
   * @param notification notification element
   */
  private updateNotifications(notification: INotification) {

    // checks whether the message is alrady present in notifications
    const index = this.notifications.map(function (e) { return e.message; }).indexOf(notification.message);

    if (!this.allowDuplicates) {
      if (index !== -1) {
        return;
      }
    }

    // insert notification in the first position of the array
    this.notifications.unshift(notification);

    // remove the last inserted element if max has reached
    if (this.notifications.length > this.max) {
      this.notifications.pop();
    }


    // clear notification in given time
    setTimeout(() => {
      this.notifications.splice(index, 1);
    }, notification.duration || this.duration);

  }

  /**
   * remove the element from the array based on index
   *
   * @param index position of the element
   */
  removeNotification(index: number): void {
    this.notifications.splice(index, 1);
    return;
  }

}

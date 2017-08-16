import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetingResolverService } from './meeting/meeting-resolver.service';
import { MeetingComponent } from './meeting/meeting.component';
import { MeetingsComponent } from './meetings.component';

const routes: Routes = [
  { path: '', component: MeetingsComponent },
  { path: ':meetingId', component: MeetingComponent, resolve: {meeting: MeetingResolverService} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingsRoutingModule { }

import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';

import { CouncilMembershipsComponent } from './council-memberships.component';

export const councilMembershipsRoutes: Routes = [
    {
        path: '',
        component: CouncilMembershipsComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(councilMembershipsRoutes)
    ],
    exports: [RouterModule]
})
export class CouncilMembershipsRoutingModule {}

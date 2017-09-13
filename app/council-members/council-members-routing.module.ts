import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';

import { CouncilMemberComponent } from './council-member/council-member.component';
import { CouncilMemberCreateComponent } from './council-member-create/council-member-create.component';
import { CouncilMemberUpdateComponent } from './council-member-update/council-member-update.component';
import { CouncilMembersComponent } from './council-members.component';
import { CouncilMemberResolverService } from './shared/services/council-member-resolver.service';

export const councilMembersRoutes: Routes = [
    {
        path: '',
        component: CouncilMembersComponent
    },
    {
        path: 'create',
        component: CouncilMemberCreateComponent
    },
    {
        path: ':councilMemberId',
        component: CouncilMemberComponent,
        resolve: {
            councilMember: CouncilMemberResolverService
        }
    },
    {
        path: 'update/:councilMemberId',
        component: CouncilMemberUpdateComponent,
        resolve: {
            councilMember: CouncilMemberResolverService
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(councilMembersRoutes)
    ],
    exports: [RouterModule]
})
export class CouncilMembersRoutingModule {}

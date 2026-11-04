import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { TodayPage } from './pages/today-page/today-page';
import { HistoricPage } from './pages/historic-page/historic-page';
import { MetricsPage } from './pages/metrics-page/metrics-page';

export const routes: Routes = [
    {path: '',component: MainLayout, children:[
        {path: '',redirectTo:'today', pathMatch:'full'},
        {path: 'today', component: TodayPage},
        {path: 'historic', component: HistoricPage},
        {path: 'metrics', component: MetricsPage},
        // {path: 'recipes', component: RecipesPage},
        // {path: 'recipes/new', component: NewRecipePage},
        // {path: 'recipes/:id', component: RecipeDetailPage},
        // {path: 'ingredients', component: IngredientsPage}
    ]},
];

import { Observable } from 'rxjs';

export interface IUserDataService {
    getUserProfile(userId: string): Observable<any>;
}

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../user/user";
import {BehaviorSubject, lastValueFrom, Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class SecurityService {

    private currentUserSubject = new BehaviorSubject<User | null>(null);

    private instanceSubject: BehaviorSubject<string>

    private token: string | null;

    constructor(private readonly httpClient: HttpClient) {
        this.instanceSubject = new BehaviorSubject<string>(localStorage.getItem('instance') || 'gitlab.com');
        this.token = localStorage.getItem('token') || null;
    }

    public async login(instance: string, token: string): Promise<User> {
        try {
            const user = await lastValueFrom(this.httpClient.get<User>('/user', {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            }));
            this.instanceSubject.next(instance);
            localStorage.setItem('instance', instance);
            this.token = token;
            localStorage.setItem('token', token);

            this.currentUserSubject.next(user);
            return user;
        } catch (error) {
            this.currentUserSubject.next(null);
            throw new Error('Invalid token');
        }
    }

    public async findCurrentUser(): Promise<User | null> {
        if (this.token === null) {
            return null;
        }

        if (this.currentUserSubject.value !== null) {
            return this.currentUserSubject.value;
        }

        try {
            return await this.login(this.instanceSubject.value, this.token);
        } catch (error) {
            return null;
        }
    }

    public watchCurrentUser(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }

    public getInstance(): string {
        return this.instanceSubject.value;
    }

    public watchInstance(): Observable<string> {
        return this.instanceSubject.asObservable();
    }

    public getToken(): string | null {
        return this.token;
    }
}

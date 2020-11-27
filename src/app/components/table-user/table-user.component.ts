import { DataSource } from '@angular/cdk/table';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from 'src/app/models/User.model';
import { UserService } from 'src/app/services/user.service';
import { TableUserDataSource } from './table-user-datasource';

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.scss']
})
export class TableUserComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<User>;

  isLoadingResults = true;
  pageEvent: PageEvent;


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['Id', 'nom', 'prenom', 'actions'];

  userSubscription: Subscription;
  coutnSubscription: Subscription;

  pageSize = 5;
  actualPage = 0;
  userNumber = 0;



  constructor(private userService: UserService) {


    this.userSubscription = this.userService.userSubject.subscribe(
      (users: User[]) => {
        // this.dataSource = new TableUserDataSource(users);
        // this.dataSource.setData(users);
        console.log(users);
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;


        this.dataSource.filterPredicate = (data, filter) => {

          let mergedData = (data.Id + '' + data.nom + data.prenom + data.mail).toLocaleLowerCase();

          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }

          return mergedData.indexOf(filter.toLowerCase()) !== -1;
        }

        this.isLoadingResults = false;
      }
    );

    this.coutnSubscription = this.userService.userCountSubject.subscribe(
      (data: number) => {
        this.userNumber = data;
        console.log(this.userNumber);
      });
  }

  ngOnInit() {
    // this.dataSource = new TableUserDataSource([]);

    this.userService.getUsers();

    this.userService.countUser();
  }


  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.coutnSubscription.unsubscribe();
  }

  onUpdate(user: User) {
    this.userService.setOpenedUser(user);
  }

  onDelete(user: User) {
    this.userService.deleteUser(user.Id);
  }

  public getServerData(event?: PageEvent) {
    this.userService.getUsers(event.pageIndex, event.pageSize);
    this.pageSize = event.pageSize;
    this.actualPage = event.pageIndex;
    this.userNumber = event.length;
    console.log(event);
    return event;
  }

  onRowClicked(row: User) {
    this.userService.setOpenedUser(row);
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

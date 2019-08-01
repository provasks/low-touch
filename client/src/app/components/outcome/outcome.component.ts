import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-outcome',
  templateUrl: './outcome.component.html',
  styleUrls: ['./outcome.component.scss']
})
export class OutcomeComponent implements OnInit {
  filteredHosts: [];
  pagination = {
    currentPage: 1,
    totalRecords: 0,
    pageSize: 20,
    maxNumberOfPages: 20,
    pages: [],
    from: 0,
    to: 0,
    records: []
  };
  cluster_uuid: any;
  sys_serial_number: any;
  aggr_name: any;
  hostname: any;
  id: any;
  filterText: any;
  subscription: any;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  getOffset() {
    return (this.pagination.currentPage - 1) * this.pagination.pageSize + 1;
  }

  getFrom() {
    return this.getOffset();
  }

  getTo() {
    const to = this.getOffset() + this.pagination.pageSize - 1;
    return to > this.filteredHosts.length ? this.filteredHosts.length : to;
  }

  getPageCount() {
    return Math.ceil(this.filteredHosts.length / this.pagination.pageSize);
  }

  ngOnInit() {
    this.filterText = this.route.snapshot.params['outcome'];
    this.pagination.currentPage = Number.parseInt(
      this.route.snapshot.params['pnr']
    );

    this.subscription = this.apiService
      .getHostsWithMatchingOutcome(this.filterText)
      .subscribe(data => {
        this.filteredHosts = data;
        this.pagination.pageSize = this.getPageSize();

        if (this.filteredHosts.length)
          this.filteredHosts['headers'] = [
            'Hostname',
            'Aggregate',
            'Cluster',
            'Serial',
            'Customer',
            'Model',
            'Review'
          ];
        this.setPages();
      });
  }
  getPageSize(): number {
    return this.filteredHosts.length >
      this.pagination.maxNumberOfPages * this.pagination.pageSize
      ? Math.ceil(this.filteredHosts.length / this.pagination.maxNumberOfPages)
      : this.pagination.pageSize;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterContentChecked() {
    const pnr = Number.parseInt(this.route.snapshot.params['pnr']);
    if (this.filteredHosts) this.displayRecords(pnr);
  }
  setPages() {
    for (let i = 1, l = this.getPageCount(); i <= l; i++) {
      this.pagination.pages.push(i);
    }
  }

  setPageInfo(page) {
    this.pagination.currentPage = page;
    this.pagination.from = this.getFrom();
    this.pagination.to = this.getTo();
  }

  changePage(evt, page) {
    this.router.navigate([`outcomes/${this.filterText}/${page}`]);
  }

  displayRecords(page) {
    this.setPageInfo(page);
    this.pagination.records = this.filteredHosts.slice(
      this.pagination.from - 1,
      this.pagination.to
    );
  }

  gotoNext() {
    this.changePage(undefined, this.pagination.currentPage + 1);
  }
  gotoPrevious() {
    this.changePage(undefined, this.pagination.currentPage - 1);
  }
}

import { Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { Status } from '../../../../components/status/status';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLinkWithHref, Status],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}

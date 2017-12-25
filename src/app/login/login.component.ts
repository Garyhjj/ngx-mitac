import { AuthService } from './../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm:FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName:['', Validators.required],
      password:['', Validators.required],
      remember:[false]
    })
  }

  login() {
    let value = this.validateForm.value;
    delete value.remember;
    this.authService.login(value);
  }
}

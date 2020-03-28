import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthentificationService } from 'src/app/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;

  contactSend: ContactDetail = {
    nameUser: '',
    emailUser: '',
    subject: '',
    message: ''
  }

  constructor(private formBuilder: FormBuilder, private auth: AuthentificationService, private router: Router) { }

  ngOnInit(): void {
    this.initContactForm()
  }

  initContactForm() : FormGroup {
    if(this.auth.isLoggedIn()) {
      const emailUser = this.auth.getUserDetails().email
      return this.contactForm = this.formBuilder.group({
        nameUser: ['', Validators.required],
        email: [emailUser, [Validators.required, Validators.email]],
        subject: ['', Validators.required],
        message: ['', Validators.required]
      });
    } else {
      return this.contactForm = this.formBuilder.group({
        nameUser: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        subject: ['', Validators.required],
        message: ['', Validators.required]
      });
    }
    
  }

  sendEmail() {

    const formValue = this.contactForm.value;

    this.contactSend.nameUser = formValue.nameUser
    this.contactSend.emailUser = formValue.email
    this.contactSend.subject = formValue.subject
    this.contactSend.message = formValue.message

    this.auth.sendEmailContact(this.contactSend).subscribe(
      this.router.navigate([''])
    );

  }

}

export interface ContactDetail {
  nameUser: string
  emailUser: string
  subject: string
  message: string
}
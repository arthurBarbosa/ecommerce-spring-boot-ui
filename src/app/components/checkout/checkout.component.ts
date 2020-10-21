import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AbcodeShopFormService } from 'src/app/services/abcode-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private abcodeShopService: AbcodeShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),

    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMont: " + startMonth);

    this.abcodeShopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrivied credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.abcodeShopService.getCreditYears().subscribe(
      data => {
        console.log("Retrivied credit card years " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )




  }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }

  onSubmit() {
    console.log(`handling the submit button`);
    console.log(this.checkoutFormGroup.get('customer').value)

  }

  handleMonthsAndYears(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYears: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, the start with the current month

    let startMonth: number;

    if(currentYear === selectedYears){
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.abcodeShopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrivied credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

}

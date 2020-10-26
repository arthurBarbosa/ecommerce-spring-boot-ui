import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { AbcodeShopFormService } from 'src/app/services/abcode-shop-form.service';
import { AbcodeShopValidators } from 'src/app/validators/abcode-shop-validators';

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

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
    private abcodeShopService: AbcodeShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  AbcodeShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
                                [Validators.required,
                                Validators.minLength(2),
                                AbcodeShopValidators.notOnlyWhitespace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
                                [Validators.required,
                                Validators.minLength(2),
                                AbcodeShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
                              [Validators.required,
                              Validators.minLength(2),
                              AbcodeShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
                                [Validators.required,
                                Validators.minLength(2),
                                AbcodeShopValidators.notOnlyWhitespace]),
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

    // populate countries
    this.abcodeShopService.getCountries().subscribe(
      data => {
        console.log('Retrivied countries: ' + JSON.stringify(data))
        this.countries = data;
      }
    )


  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates = this.shippingAddressStates;

    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log('Handling the submit button ')

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(`handling the submit button`);
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log('The email address is ' + this.checkoutFormGroup.get('customer').value.email);
    console.log('The shipping address country is ' + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log('The shiping address state is ' + this.checkoutFormGroup.get('shippingAddress').value.state.name);

  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYears: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, the start with the current month

    let startMonth: number;

    if (currentYear === selectedYears) {
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

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.abcodeShopService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    )
  }

}

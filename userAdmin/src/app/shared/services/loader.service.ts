import { Injectable } from '@angular/core';
declare var $: any;

@Injectable()
export class LoaderService {

   constructor() { }

   showLoader() {
      $('.page-loading').css('z-index', 99999999999999999).css('opacity', 1);
   }
   hideLoader() {
      $('.page-loading').css('z-index', -1).css('opacity', 0);
   }

}
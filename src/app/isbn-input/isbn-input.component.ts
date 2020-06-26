import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-isbn-input',
  templateUrl: './isbn-input.component.html',
  styleUrls: ['./isbn-input.component.css']
})
export class IsbnInputComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {}

  async validate(isbnList: string) {
    if (isbnList || isbnList.length > 0) {
      let isbns: string[] = this.extract(isbnList);
      let validations = await this.httpClient
        .post('http://localhost:8080/api/validate', isbns)
        .toPromise()
        .then(data => { return data; });
      let output = '';
      Object.entries(validations).forEach(validation => {
        output += 'ISBN ' + validation[1]['isbn'] + ' = ' + (validation[1]['valid'] ? 'valid' : 'not valid') + '\n';
      });
      alert(output);
    }
  }

  extract(isbnList: string): string[] {
    let isbns = isbnList.split(',');
    for (let i = 0; i < isbns.length; i++) {
      let regex = '^[X,0-9,-]*$';
      if (isbns[i].trim().match(regex)) {
        isbns[i] = isbns[i].trim().replace(/-/g, "").replace(" ","");
      } else {
        alert('Invalid Input: ' + isbns[i]);
        isbns.splice(i, 1);
        i--;
      }
    }
    return isbns;
  }

}

import { Component } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, HttpClientModule], 
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  imageUrl: string | ArrayBuffer | null = null;
  plateNumber: string = '';
  error: string = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.imageUrl = reader.result;
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ plate: string, error:string }>('https://mhd-ocr-poc.up.railway.app/upload/', formData)
      .subscribe(
        response => {
          if (!response.plate) {
            this.error = response.error;
            this.plateNumber = ''
            return;
          }
          this.plateNumber = response.plate;
          this.error = '';
        },
        error => console.error('Error:', error)
      );
  }
}

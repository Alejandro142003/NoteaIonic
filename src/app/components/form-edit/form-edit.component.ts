import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Note } from 'src/app/model/note';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-edit',
  standalone: true,
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FormEditComponent {
  @Input() note!: Note;
  constructor(private modalCtrl: ModalController,) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(note: Note) {
    console.log(note);
    return this.modalCtrl.dismiss(note.title,note.description, 'confirm');
  }
}

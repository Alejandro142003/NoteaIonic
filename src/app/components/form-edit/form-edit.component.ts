import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Note } from 'src/app/model/note';
import { CommonModule } from '@angular/common';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-form-edit',
  standalone: true,
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FormEditComponent implements OnInit {
  @Input() note!: Note;
  public noteS: NoteService;
  img: boolean = false;
  location: boolean = false;
  showImage: boolean = false;

  constructor(noteS: NoteService, private modalCtrl: ModalController) {
    this.noteS = noteS;
  }

  ngOnInit() {
    console.log(this.note);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    console.log('Estado imagen:' + this.img);
    console.log('Estado location:' + this.location);

    if (this.img) {
      this.note.img = '';
    } else if (this.location) {
      this.note.position = '';
    }

    console.log(this.note);

    return this.modalCtrl.dismiss(this.note, 'confirm');
  }
}

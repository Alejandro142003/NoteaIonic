import { Component, inject } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { FormEditComponent } from '../components/form-edit/form-edit.component';
import { UIService } from '../services/ui.service';
import {
  BehaviorSubject,
  Observable,
  from,
  map,
  mergeMap,
  tap,
  toArray,
} from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab2Page {
  public noteS = inject(NoteService); //noteS.notes$
  private UIS = inject(UIService);
  public _notes$: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  public isInfiniteScrollAvailable: boolean = true;
  private lastNote: Note | undefined = undefined;
  private notesPerPage: number = 15;

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {}

  ionViewDidEnter() {}

  async editNote(note: Note) {
    console.log(note);
    const modal = await this.modalCtrl.create({
      component: FormEditComponent,
      componentProps: { note: note },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.noteS.updateNote(data);
      await this.UIS.showToast('Nota modificada correctamente', 'success');
      await this.UIS.hideLoading();
    }
  }

  async deleteNote(note: Note) {
    const alert = await this.alertController.create({
      header: 'Eliminar nota',
      message: '¿Estás seguro que quieres eliminar la nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelación de eliminación');
          },
        },
        {
          text: 'Borrar',
          handler: () => {
            this.noteS
              .deleteNote(note)
              .then(async () => {
                await this.UIS.showToast(
                  'Nota eliminada correctamente',
                  'success'
                );
              })
              .catch(async (error) => {
                console.error('Error al eliminar la nota', error);
                await this.UIS.showToast('Error al eliminar la nota', 'danger');
              });
          },
        },
      ],
    });
    await alert.present();
  }

  async onSwipe(event: any, note: Note) {
    if (event.detail.side === 'start') {
      this.editNote(note);
    } else if (event.detail.side === 'end') {
      this.deleteNote(note);
    }
  }

  loadNotes(fromFirst: boolean, event?: any) {
    if (fromFirst == false && this.lastNote == undefined) {
      this.isInfiniteScrollAvailable = false;
      event.target.complete();
      return;
    }
    this.convertPromiseToObservableFromFirebase(
      this.noteS.readNext(this.lastNote, this.notesPerPage)
    ).subscribe((d) => {
      event?.target.complete();
      if (fromFirst) {
        this._notes$.next(d);
      } else {
        this._notes$.next([...this._notes$.getValue(), ...d]);
      }
    });
  }

  private convertPromiseToObservableFromFirebase(
    promise: Promise<any>
  ): Observable<Note[]> {
    return from(promise).pipe(
      tap((d) => {
        if (d.docs && d.docs.length >= this.notesPerPage) {
          this.lastNote = d.docs[d.docs.length - 1];
        } else {
          this.lastNote = undefined;
        }
      }),
      mergeMap((d) => d.docs),
      map((d) => {
        return { key: (d as any).id, ...(d as any).data() };
      }),
      toArray()
    );
  }

  loadMore(event: any) {
    this.loadNotes(false, event);
  }
  
  doRefresh(event: any) {
    this.isInfiniteScrollAvailable = true;
    this.loadNotes(true, event);
  }
}

// firebase.js — configuração partilhada entre todos os ficheiros da app
// Importar: import { db, auth } from './firebase.js';

import { initializeApp }   from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore }    from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth }         from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const FB = {
  apiKey:            'AIzaSyALyrpFSGx4evXtOYCfRIvWc_jTjByz0R8',
  authDomain:        'hm-projetos-lm.firebaseapp.com',
  projectId:         'hm-projetos-lm',
  storageBucket:     'hm-projetos-lm.firebasestorage.app',
  messagingSenderId: '772658359928',
  appId:             '1:772658359928:web:98332ec006329f380ec78d',
};

const app = initializeApp(FB);

export const db   = getFirestore(app);
export const auth = getAuth(app);

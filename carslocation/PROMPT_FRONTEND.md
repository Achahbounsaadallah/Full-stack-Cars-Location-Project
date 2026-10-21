# Prompt d'implementation du frontend React - Cars Location

Tu es un agent d'implementation avec acces au terminal, au systeme de fichiers et au navigateur. Cree et verifie un frontend React moderne pour la plateforme de location de voitures dont le backend Spring Boot est deja present dans ce workspace. Ne t'arrete pas a un plan : implemente le produit et verifie son fonctionnement.

## Objectif

Construire une experience de location simple, premium et responsive, en francais, qui permet a un visiteur de :

- rechercher une voiture disponible entre une date de prise en charge et une date de retour ;
- filtrer les resultats par categorie, prix, carburant, transmission et nombre de places ;
- consulter les caracteristiques d'une voiture ;
- se connecter ou creer un compte ;
- envoyer une demande de reservation pour une voiture ;
- consulter et annuler ses reservations depuis son espace personnel.

Le frontend doit consommer le backend existant. Ne pas inventer de routes qui ne sont pas implementees.

## Backend de reference

- Stack : Spring Boot 3.2.5, Java 17, API REST, JWT.
- URL configurable : `VITE_API_URL`, valeur locale par defaut `http://localhost:8080`.
- Authentification : `POST /api/auth/login` avec `{ email, password }`, reponse `{ accessToken, tokenType }`.
- Inscription : `POST /api/auth/register` avec `{ firstName, lastName, email, password, phone }`.
- Catalogue : `GET /api/v1/cars` et `GET /api/v1/cars/{id}`.
- Disponibilite : `GET /api/v1/cars/available?startDate=...&endDate=...`.
- Categories : `GET /api/v1/categories`.
- Verification ponctuelle : `GET /api/v1/availabilities/check?carId=...&startDate=...&endDate=...`.
- Creation d'une reservation : `POST /api/v1/bookings` avec `{ carId, pickupDate, returnDate }`.
- Mes reservations : `GET /api/v1/bookings/my-bookings`.
- Annulation : `PATCH /api/v1/bookings/{id}/cancel`.

Toutes les requetes protegees doivent envoyer `Authorization: Bearer <accessToken>`. Stocker uniquement le token necessaire dans `localStorage`, gerer les erreurs 401 et permettre la deconnexion.

## Pages et parcours

Implementer une SPA avec React Router ou un routage leger equivalent :

1. Accueil / catalogue
   - header avec logo `NOVA DRIVE`, liens Catalogue, Comment ca marche, Mes reservations et actions Connexion/Inscription ;
   - hero editorial avec titre `La route vous appartient.` et formulaire de recherche ;
   - dates obligatoires, validation de l'ordre chronologique et bouton de recherche ;
   - liste de voitures disponible, etat de chargement, etat vide et message d'erreur ;
   - cartes voiture avec visuel, marque, modele, categorie, places, transmission, carburant et prix journalier ;
   - bouton `Voir le vehicule`.

2. Detail voiture
   - galerie visuelle elegante (si le backend ne fournit pas d'image, utiliser un visuel local ou une image distante stable avec un fallback visuel) ;
   - resume des specifications depuis `CarResponseDTO` ;
   - prix par jour, estimation du total selon la duree choisie ;
   - rappel des dates et bouton de reservation ;
   - si l'utilisateur n'est pas connecte, ouvrir la connexion puis reprendre le parcours.

3. Authentification
   - pages ou panneaux Connexion et Inscription ;
   - validations accessibles, erreurs API lisibles, etat de soumission ;
   - apres connexion, retour vers l'action initiale sans perdre les dates ni la voiture.

4. Mes reservations
   - route protegee ;
   - cartes ou tableau des reservations avec numero, vehicule, dates, montant, statut et date de creation ;
   - bouton d'annulation uniquement quand le statut le permet ;
   - etat non connecte, chargement, vide et erreur.

## Direction visuelle

Ne pas reproduire VEYRA ni fabriquer une landing page de voiture electrique. Le produit est un service de location fiable, clair et haut de gamme.

- Style : magazine automobile contemporain, contraste entre fond ivoire chaud et encre presque noire, accent orange cuivre pour les actions.
- Typographie : une sans-serif lisible pour l'interface et une serif expressive uniquement pour les grands titres, via Google Fonts ou une alternative systeme fiable.
- Palette recommandee : `#f4f1eb`, `#171817`, `#d9693b`, `#e4ded4`, `#788078`, `#ffffff`.
- Grille a largeur mesuree, beaucoup d'espace, bordures fines, rayons moderes et ombres tres discretes.
- Les cartes doivent privilegier les informations de location, pas des badges marketing inventes.
- Animations courtes et utiles : apparition des resultats, transitions de filtres, feedback des boutons. Respecter `prefers-reduced-motion`.
- Le design doit etre pleinement utilisable au clavier : focus visible, labels associes, dialogues fermables avec Escape, ordre de tabulation logique et annonces d'erreur.
- Aucune donnee fictive ne doit etre presentee comme venant de l'API. Les valeurs de secours doivent etre clairement visuelles et non metier.

## Regles fonctionnelles

- Les prix affiches utilisent `dailyBasePrice` et la devise EUR, avec formatage francais.
- La duree est calculee en jours calendaires, avec un minimum d'un jour.
- Les dates envoyees au backend doivent etre des `LocalDateTime` ISO compatibles, par exemple `2026-10-20T10:00:00`.
- Le bouton de reservation est desactive tant que les dates sont invalides ou qu'une requete est en cours.
- Apres une reservation reussie, afficher une confirmation claire et proposer d'aller dans Mes reservations.
- Ne pas ajouter paiement, prix inventes, assurance, points de fidelite, avis ou fonctionnalites administrateur : ils n'existent pas dans ce backend.
- Ne pas exposer les routes de creation/modification admin dans l'interface client.

## Architecture attendue

- React + TypeScript + Vite.
- Organiser le code en `components`, `pages`, `services`, `types` et `hooks` si cela reste utile.
- Centraliser le client HTTP, l'URL API et la gestion JWT.
- Typer les DTO frontend : voiture, categorie, reservation, authentification et erreurs API.
- Utiliser des composants reutilisables pour le header, formulaire de recherche, carte voiture, filtres, modal auth, toast et etats de chargement.
- Ne pas ajouter de bibliotheques lourdes si une implementation native suffit.

## Verification obligatoire

1. Installer les dependances et lancer le frontend.
2. Executer le lint et le build de production.
3. Tester avec le backend demarre : catalogue, recherche de disponibilite, detail, inscription, connexion, creation de reservation, liste et annulation.
4. Verifier les tailles 1440x900, 1280x720, 768x1024 et 390x844.
5. Verifier absence de debordement horizontal, navigation clavier, erreurs reseau, token absent/expire et `prefers-reduced-motion`.

## Livrable

Retourner l'URL locale du frontend, le chemin du projet, les commandes utilisees, les flux verifies et les limitations reelles, notamment si le backend ou la base SQL Server n'est pas demarre. Ne pas publier le projet et ne pas modifier les secrets du backend.

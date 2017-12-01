var app = {
  init: function() {
    // On ajoute un event sur le bouton permettant de charger la première page de personnage
    $('#peopleButton').on('click', app.loadPeoples);
  },
  // Cette fonction met à jour la liste des personnages
  loadPeoples: function(evt) {

    // On récupère l'url à charger avec ajax via l'attribut 'data-page' des boutons
    url = $(evt.target).attr('data-page');

    // Dans le cas des boutons PREV et NEXT si on a atteint la fin des listes on stoppe le chargement
    if(url === 'end') return;

    // requête Ajax
    $.ajax(url, {
      success: function(data) {
        console.log(data);

        // Met à jour la div des boutons de pagination
        // On récupère le template 'pagination.html'
        $.ajax('templates/pagination.html', {
          success: function(paginationTempl) {

            // On modifie les attributs 'data-page' des boutons PREV et NEXT
            paginationTempl = app.pagination(data.previous, data.next, paginationTempl);

            // On injecte le texte dans la div #pagination
            $('#pagination').html(paginationTempl);

            // On oublie pas d'ajouter un event sur nos boutons
            $('.paginationButton').on('click', app.loadPeoples);
          }
        });

        // Met à jour la div contenant la liste des personnages en ajoutant une liste <ul>
        var listPeople = '<ul>';
        for (var nbrPeople = 0; nbrPeople < data['results'].length; nbrPeople++) {
          // On ajoute un id unique à chaque personnage selon l'url qui permet de récupérer leur données
          var peopleId = data['results'][nbrPeople]['url'].split('/');
          peopleId = peopleId[peopleId.length - 2];

          // On ajoute les <li> correspondant aux personnages de la page demandée
          listPeople += '<li id="people§' + peopleId + '" class="people">' + data['results'][nbrPeople]['name'] + '</li>';
        }
        listPeople += '</ul>';

        // On injecte le texte dans la div #peopleList
        $('#peopleList').html(listPeople);

        // On rend le nom des personnages cliquable afin de pouvoir afficher ses détails (voir app.peopleDetails)
        $('.people').on('click', data['results'], app.peopleDetails);
      }
    });
  },
  // Cette fonction met à jour la div contenant les détails du personnage sélectionné
  peopleDetails: function(evt) {

    // event.data contient l'objet passé en argument lors de la création de l'event. A ne pas confondre avec le data de la requête Ajax !!!
    console.log(evt.data);

    // On récupère la position du personnage dans la liste
    var liPos = $(evt.target).index();

    // On récupère le template 'people_details.html'
    $.ajax('templates/people_details.html', {
      success: function(peopleDetailsTempl) {

        // peopleDetailsTempl contient le texte brut du template
        // insertData() permet d'y insérer les données du personnage
        peopleDetailsTempl = app.insertData(evt.data[liPos].name, 'characterName', peopleDetailsTempl);
        peopleDetailsTempl = app.insertData(evt.data[liPos].gender, 'characterGender', peopleDetailsTempl);
        peopleDetailsTempl = app.insertData(evt.data[liPos].species, 'characterSpecies', peopleDetailsTempl);
        peopleDetailsTempl = app.insertData(evt.data[liPos].height, 'characterHeight', peopleDetailsTempl);
        peopleDetailsTempl = app.insertData(evt.data[liPos].mass, 'characterMass', peopleDetailsTempl);
        peopleDetailsTempl = app.insertData(evt.data[liPos].birth_year, 'characterBirthYear', peopleDetailsTempl);
        peopleDetailsTempl = app.insertData(evt.data[liPos].homeworld, 'characterHomeworld', peopleDetailsTempl);
        peopleDetailsTempl = app.insertData(evt.data[liPos].skin_color, 'characterSkinColor', peopleDetailsTempl);
        peopleDetailsTempl = app.insertData(evt.data[liPos].hair_color, 'characterHairColor', peopleDetailsTempl);
        peopleDetailsTempl = app.insertData(evt.data[liPos].eye_color, 'characterEyesColor', peopleDetailsTempl);
        peopleDetailsTempl = app.insertData(evt.data[liPos].films, 'characterFilms', peopleDetailsTempl);

        // On injecte le texte dans la div #peopleDetails
        $('#peopleDetails').html(peopleDetailsTempl);
      }
    });
  },
  // Permet d'insérer au bon endroit, les données du personnage
  // Prend en arguments la valeur à insérer, la classe de la balise qui doit contenir la valeur et le template
  insertData: function(dataValue, className, template) {
    var a = template;
    var b = dataValue;

    // On vise la position ou commencer l'insertion
    var classPosition = template.indexOf(className);
    var dataPosition = template.indexOf('>', classPosition) + 1;

    // Et on insère !
    var output = [a.slice(0, dataPosition), b, a.slice(dataPosition)].join('');

    return output;
  },
  // Très similaire à insertData() on vient modifier les attributs data-page="" des boutons de pagination
  // data-page="" contiendra l'url de la page précédente et suivante que l'on utilisera pour nos requête Ajax
  pagination: function(previous, next, template) {

    // Si data.previous et data.next contiennent null c'est qu'il n'y a plus de page précédente ou suivante
    if(previous === null) previous = 'end';
    if(next === null) next = 'end';

    // On vise le bouton PREVIOUS et on insère dans data-page="" l'url de la page précédente
    var position = template.indexOf('name="prev"') - 2;
    var output = [template.slice(0, position), previous, template.slice(position)].join('');

    // On vise le bouton NEXT et on insère dans data-page="" l'url de la page suivante
    var position = output.indexOf('name="next"') - 2;
    var output = [output.slice(0, position), next, output.slice(position)].join('');

    return output;
  }
};

$(app.init);

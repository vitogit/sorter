var App = function() {

  var self = this

  this.tinyDom;

  this.init = function() {
    

      
    $('.bookmark_link').click(function(){
      var hashtag = $(this).text()
      $('#filter_box').val(hashtag)
      $('#filter_box').trigger("input")
    })

    $('#container').on('click', '.file_link', function(){
      var fileId = $(this).data('id');
      app.loadNotes(fileId);
    })

    $('#container').on('click', '.filter_clear', function(){
      $('#filter_box').val("")
      app.filter()
    })

    $('#container').on('click', '.filter_link', function(){
      var type = $(this).text()[0];
      var hashtag =  type+$(this).data('name')
      $('#filter_box').val(hashtag)
      $('#filter_box').trigger("input")
    })

    $('#container').on('click', '.hideThisTag', function(){
      app.filter();
    })
    
    $(this.tinyDom).on('click', '.hash_link', function(){
      var hashtag =  '#'+$(this).data('name')
      $('#filter_box').val(hashtag)
      $('#filter_box').trigger("input")
    })

    tinymce.init({
      selector: '#editor',
      width: '100%',
      height: '100%',
      statusbar: false,
      menubar:false,
      content_css : 'simplex.bootstrap.min.css, editor.css',
      plugins: [
        'autolink lists link save autoresize'
      ],
      save_enablewhendirty: true,
      save_onsavecallback: function () { app.saveBookmark(); app.parseHashtags(); app.applyStyles(); app.saveNotes(); app.loadBookmark(); },
      toolbar: 'bullist save removeformat',
      setup : function(ed){
        ed.on('init', function() {
          this.getDoc().body.style.fontSize = '14px';
          app.tinyDom = tinyMCE.activeEditor.dom.getRoot()
        });
      }
    });
  }

  this.filter = function() {
    var current_text = $('#filter_box').val()
    var hashtags = current_text.replace(/  +/g, ' ').replace(/\$/g, '\\$').split(' ')
    hashtags = hashtags.filter(function(h){ return h != "" });

    var tagsToHide = $('.hideThisTag:checked').map(function() {
                        return $(this).val().replace(/\$/g, '\\$');
                     }).get();
    tagsToHide = tagsToHide.filter(function(h){ return h != "" });

    $(this.tinyDom).find('li').hide()
    $(this.tinyDom).find('li').each(function() {
      var li_text = $(this).clone().children('ul').remove().end().html();
      //filter using OR
      if (new RegExp(hashtags.join("|")).test(li_text)) {
        $(this).show()
        $(this).parents().show()
        $(this).find('li').show()
      }
      
      if (tagsToHide.length && new RegExp(tagsToHide.join("|")).test(li_text)) {
        $(this).hide()
        $(this).find('li').hide()
      }      
    })
  }

  this.parseHashtags = function() {
    var initText = $(this.tinyDom).html()
    var parsedText = initText.replace( /#(\w+)\b(?!<\/a>)/g ,'<a class="hash_link" data-name="$1" href="#">#$1</a>')
    parsedText = this.parseSmartTags(parsedText);
    $(this.tinyDom).html(parsedText);
    this.extractAllTags();
  }

  this.parseSmartTags = function(initText) {
    return initText.replace(/\$(\w+)\b(?!<\/a>)/g, function (match, smartTag) {
      var newLink = $("<a />", {
          href : "#",
          class : 'smartTag',
          'data-name': smartTag,
          text : '$'+smartTag
      })
     
      if (smartTag == 'completed') {
        newLink.addClass('completed bg-success')
      } else if (smartTag == 'todo') {
        newLink.addClass('todo bg-warning')
      } else if (smartTag == 'journal') {
        newLink.addClass('journal bg-info')
      } else {

      }
      return newLink.prop('outerHTML');
    });
  }

  this.extractTags = function(class_name, type) {
    var tagMap = {}
    $(this.tinyDom).find('a.'+class_name).each(function(){
      var name = $(this).data('name')
      if (tagMap[name]) {
        tagMap[name] = tagMap[name]+1
      } else {
        tagMap[name] = 1
      }
    })
    
    var tagMapSorted = {};
    Object.keys(tagMap).sort().forEach(function(key) {
      tagMapSorted[key] = tagMap[key];
    });    

    $.each(tagMapSorted, function( name, count ) {
      var newLink = $("<a />", {
          'data-name': name,
          href : "#",
          text : type+name+"("+count+")",
          class: 'filter_link'
      });

      $('#allTags').append(newLink).append('<br/>')
    });
  }

  this.extractAllTags = function() {
    $('#allTags').html("")
    this.extractTags('smartTag','$');
    this.extractTags('hash_link','#');
  }  

  //variable to reference the file id that we are modified, used when updated it
  this.current_file = {
      content: '',
      id:null,
      name: 'sorter_notes'
  };
  
  this.bookmark;
  this.saveBookmark = function() {
    this.bookmark = tinymce.activeEditor.selection.getBookmark(2,true);
  }
  this.loadBookmark = function() {
    tinymce.activeEditor.selection.moveToBookmark(this.bookmark);
  }
  
  this.saveNotes = function() {
    this.current_file.content = $(this.tinyDom).html()
    driveService.saveFile(self.current_file, function(file){
      self.current_file = file
      console.log('saved file with id:'+file.id)
    })
  }

  this.loadNotes = function(fileId) {
    var file = {id: fileId }
    window.driveService.loadFile(file, function(file){
      self.current_file = file;
      $(self.tinyDom).html(file.content);
      self.extractAllTags();
      self.filter();
    })
  }

  this.notes = []
  this.listNotes = function() {
    window.driveService.listFiles(function(err, files){
      if (err) {
        console.log('List error:'+err)
        return
      }
      $('#fileFinder ol').html("");
      self.notes = []
      $.each(files, function( index, file ) {
        self.notes.push(file)
        var li = $('<li/>')
        var newLink = $("<a />", {
            href : "#",
            class: 'file_link',
            'data-id': file.id,
            'data-name': file.name,
            text: file.name
        }).appendTo(li);
        $('#fileFinder ol').append(li)
      });
      //todo move this to a better place
      if (files.length) {
          self.current_file = files[0]
          self.loadNotes(self.current_file.id)
      }
    })
  }

  this.applyStyles = function() {
    $(this.tinyDom).find('a.smartTag').each(function() {
      var classes = $(this).prop('class')
      $(this).parent().removeClass();
      $(this).parent().addClass(classes);
    })
  }
};

var Util = function() {
  this.formatDate = function(date) {
    return date.split('.')[0].replace('T', ' ').replace(/-/g,'/')
  }
}

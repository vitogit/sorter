var App = function() {

  var self = this
  
  this.sorter;
  
  this.tinyDom;
  
  this.init = function() {

    $('#container').on('click', '.bookmark_link', function(){
      app.filterBox(this)
    })
    
    $('#container').on('click', '.sub_bookmark_link', function(){
      var type = $(this).text()[0];
      var hashtag =  type+$(this).data('name')
      $('#filter_box').val('& #current_sprint '+hashtag)
      $('#filter_box').trigger("input")
    })
    
    $('#container').on('click', '.notebook_link', function(){
      var fileId = $(this).data('id');
      app.loadNotes(fileId);
    })

    $('#container').on('click', '.filter_clear', function(){
      $('#filter_box').val("")
      app.filter()
    })

    $('#container').on('click', '.filter_link', function(){
      app.filterBox(this)
    })

    $('#container').on('click', '.hideThisTag', function(){
      app.filter();
    })

    $('.router').click(function(){
      var name = $(this).data('name');
      $('.router').removeClass();
      $(this).addClass('active');
      
      $('.visual').hide();
      $("#"+name).show();
    })

    $('.router').click(function(){
      var name = $(this).data('name');
      if (name == "tasks") {
        app.loadTaskView();
      }
      
      $('.router').removeClass();
      $(this).addClass('active');
      
      $('.visual').hide();
      $("#"+name).show();
    })
    
    tinymce.init({
      selector: '#editor',
      forced_root_block : '',
      width: '100%',
      height: '100%',
      statusbar: false,
      menubar:false,
      content_css : './assets/css/simplex.bootstrap.min.css, ./assets/css/editor.css',
      plugins: [
        'autolink lists link save autoresize'
      ],
      save_enablewhendirty: true,
      save_onsavecallback: function () { app.saveBookmark(); app.parseText(); app.applyStyles(); app.saveNotes(); app.loadBookmark(); },
      toolbar: 'bullist save removeformat',
      setup : function(ed){
        ed.on('init', function() {
          this.getDoc().body.style.fontSize = '14px';
          app.tinyDom = tinyMCE.activeEditor.dom.getRoot()
          app.sorter = new Sorter(app.tinyDom);
          $(app.tinyDom).on('click', '.hash_link, a.smartTag', function(){
            app.filterBox(this)
          }) 
        });
      }
    });
  }

  this.filterBox = function(s) {
    var type = $(s).text()[0];
    var hashtag =  type+$(s).data('name')
    $('#filter_box').val(hashtag)
    $('#filter_box').trigger("input")    
  }
  
  this.filter = function() {
    var current_text = $('#filter_box').val()
    var type_and = current_text.includes('&')
    
    var tagsToHide = $('.hideThisTag:checked').map(function() {
                        return $(this).val();
                     }).get();
    tagsToHide = tagsToHide.filter(function(h){ return h != "" });
    this.sorter.filter(current_text, tagsToHide, type_and);
  }

  this.parseText = function() {
    this.sorter.parseHashtags()
    this.sorter.parseSmartTags()
    this.extractAllTags()
  }

  this.extractAllTags = function() {
    $('#allTags').html("")
    $('#sprints').html("")
    this.sorter.extractTags('smartTag','$');
    this.sorter.extractTags('hash_link','#');
    this.sorter.extractCurrentSprintTags()
    this.sorter.extractSprintTags();
    
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
  
  this.newNotes = function(newFile, done) {
    driveService.saveFile(newFile, function(file){
      self.current_file = file
      console.log('saved file with id:'+file.id)
      console.log("newFile.content________",newFile.content)
      tinyMCE.activeEditor.setContent(newFile.content);
      done(file)
    })
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
      tinyMCE.activeEditor.setContent(file.content);
      self.extractAllTags();
      self.filter();
    })
  }

  this.notebooks = []
  this.listNotes = function() {
    window.driveService.listFiles(function(err, files){
      if (err) {
        console.log('List error:'+err)
        return
      }
      $('#fileFinder ol').html("");
      self.notebooks = []
      $.each(files, function( index, file ) {
        self.notebooks.push(file)
        var name = file.name.split('sorter_notes_')[1]
        var newLink = $("<a />", {
            href : "#",
            class: 'notebook_link',
            'data-id': file.id,
            'data-name': file.name,
            text: '@'+name
        })
        $('#notebooks').prepend(newLink).prepend('<br>')
      });
      //todo move this to a better place
      if (files.length) {
        self.current_file = files.filter(function ( file ) {
                              return file.name.includes('sorter_notes_home');
                            })[0];
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
    this.paintLeaves();
  }

  this.paintLeaves = function() {
    $(this.tinyDom).find('li').removeClass('leaf');
    $(this.tinyDom).find('li:not(:has(ul))').each(function() {
      $(this).addClass('leaf');
    })
  }

  this.loadTaskView = function() {
    var tasks = this.sorter.getTagAndParents('#task')
    var todos = this.sorter.getTagAndParents('$todo')
    $.each(tasks, function( index, task ) {
      var newTask = $("<li />", {
          class: 'task',
          text: task
      });
      $('#taskList').append(newTask)
    });
  } 
};

var Util = function() {
  this.formatDate = function(date) {
    return date.split('.')[0].replace('T', ' ').replace(/-/g,'/')
  }
}

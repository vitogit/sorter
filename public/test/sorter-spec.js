var  expect = chai.expect

describe('Sorter', function() {
  before(function() { 
    var editor = $('<div id="editor"> <ul> <li> root <ul> <li>child1 #hash1</li><li> child2 #hash2 <ul> <li>grandchild1</li><li>grandchild2 $completed</li></ul> </li></ul> </li></ul></div>');
    var allTags = $('<div id="allTags"></div>')
    $('body').append(editor).append(allTags)    
    sorter = new Sorter('editor')
  }); 

  it('exists', function() {
    expect(sorter).to.exist
  })

  it('has a editor property ', function() {
    expect(sorter.editor).to.exist
  })

  it('filter by hash', function() {
    expect(visibleRows()).to.be.eq(5)
    sorter.filter('#hash1');
    expect(visibleRows()).to.be.eq(2) //root and li
  })
  
  it('filter by smarttag', function() {
    sorter.filter('$completed');
    expect(visibleRows()).to.be.eq(3) //root and child and grandchild
  }) 
  
  it('filter by 2 hashtags', function() {
    sorter.filter('#hash1 #hash2');
    expect(visibleRows()).to.be.eq(5) //root and everyone
  }) 
  
  it('hide completed and search hashtags', function() {
    sorter.filter('#hash2', ['$completed']);
    expect(visibleRows()).to.be.eq(3) //root, child2 and 1 grandchild (hide one)
  })  
  
  it('parse the hashtags', function() {
    $(sorter.editor).find('li').show()
    sorter.parseHashtags();
    var parsedCount = $('.hash_link').length
    expect(parsedCount).to.be.eq(2) 
  })  

  it('parse the smartTags', function() {
    $(sorter.editor).find('li').show()
    sorter.parseSmartTags();
    var parsedCount = $('.smartTag').length
    expect(parsedCount).to.be.eq(1) 
  })  
  
  it('extract all the tags', function() {
    sorter.extractTags('smartTag','$');
    sorter.extractTags('hash_link','#');
    var tagsCount = $('#allTags a').length
    expect(tagsCount).to.be.eq(3) 
  })  
     
  // it('mounts a hello tag with a setted name', function() {
  //   tag = riot.mount('hello', {name: 'Carl'})[0]
  //   expect(tag.name).to.be.eq('Carl')
  // })
  // 
  // it('prints <h1>Hello {name}</h1> ', function() {
  //   tag = riot.mount('hello', {name: 'Carl'})[0]
  //   var tagText = document.querySelector('hello > h1').textContent
  //   expect(tagText).to.be.eq('Hello Carl')
  // })
  // 
  // it('transform name to uppercase', function() {
  //   tag = riot.mount('hello', {name: 'Carl'})[0]
  //   tag.uppercase()
  //   expect(tag.name).to.be.eq('CARL')
  // })
  
  function visibleRows() {
   return $(sorter.editor).find('li').filter(function() {
            return $(this).css('display') !== 'none';
          }).length;
  }

})

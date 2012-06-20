$(document).ready(function(){
  prettyPrint();
  $("ul.sf-menu").superfish({
    animation: {height:'show'},
    delay:     1200
});

  var project = location.pathname.match(/\/project\/(.*)/)[1];
  $.ajax({
    url: '/script/'+project,
    type: 'GET',
    dataType: 'json',
    complete: function(xhr, textStatus) {
      //called when complete
  },
  success: function(data, textStatus, xhr) {
      var lines = $('.linenums li');

      var meta = _.map(data, function(item){
        item.lines = item.lines || [];
        for (var i = 0; i < item.end; i++) {
            item.lines.push(lines[item.line+i]);
        }
        return item;
    });
      $('.linenums').on('mouseenter', 'li', meta, function(e){
       _.each(e.data, function(obj){

        if(_.include(obj.lines, e.currentTarget)){
            if(obj.content){
                $('#meta').html(obj.content);
            }
            _.each(obj.lines, function(item){
                $(item).addClass('highlighted');
            });
        }
    });
   });

      $('.linenums').on('mouseout', 'li', function(e){
        if($(e.currentTarget).hasClass('highlighted')){
        }else{
            $('.highlighted').removeClass('highlighted');
        }
    });
  },
  error: function(xhr, textStatus, errorThrown) {
      //called when there is an error
  }
});

});

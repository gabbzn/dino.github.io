// JavaScript Document

(function ($) {
  /*
	$( window ).resize(function() {
		console.log( $( window ).width() );
	});
	*/

  $("img[usemap]").rwdImageMaps();
  $(".zoom").magnify();

  $(".quantity-left-minus").click(function () {
    var qta = $("#quantity").val();
    if (isNaN(qta)) {
      qta = 1;
    } else {
      qta = parseInt(qta);
      if (qta > 1) qta = qta - 1;
    }
    $("#quantity").val(qta);
  });
  $(".quantity-right-plus").click(function () {
    var qta = $("#quantity").val();
    if (isNaN(qta)) {
      qta = 1;
    } else {
      qta = parseInt(qta);
      qta = qta + 1;
    }
    $("#quantity").val(qta);
  });

  $("#keyword").hover(function () {
    $("#tooltip").fadeToggle();
  });

  $("#filter-toggle").click(function () {
    $("#filtri-div").slideToggle("fast", function () {
      if ($("#filtri-div").css("display") == "block") {
        $("#filter-toggle").html(
          '<i class="icon icon-caret-down"></i> Hide Filters'
        );
      } else {
        $("#filter-toggle").html(
          '<i class="icon icon-caret-right"></i> Show Filters'
        );
      }
    });
  });

  //add to wishlist ************************************************************************
  $(".addToWishlist").click(function (event) {
    event.preventDefault();
    var art = $(this).attr("data-id");
    var obj = $(this);

    $.post("ajx_wishlist.asp", function (result) {
      var wish = result;

      if (art.indexOf(".") > -1) {
        var mod = art.substr(0, art.indexOf(".") + 1);
        var re = new RegExp(mod + ".{3}", "g");
      } else {
        var mod = art;
        var re = new RegExp(mod, "g");
      }

      if (wish.match(re)) {
        wish = wish.replace(re, "");
        $(obj).find(".star").attr("class", "star ion-ios-star-outline");
        $(obj).find(".testo").html("ADD TO WISHLIST");
      } else {
        wish = wish + art + "|";
        $(obj).find(".star").attr("class", "star ion-ios-star");
        $(obj).find(".testo").html("REMOVE FROM WISHLIST");
      }

      $.post("ajx_wishlist.asp", { wlist: wish });
    });
  });

  //add to cart ************************************************************************
  $(".add-to-cart").click(function (event) {
    event.preventDefault();

    var art = $(this).attr("data-id");

    $.post("ajx_cart.asp", function (result) {
      var cart = result;

      if (cart.indexOf(art) > -1) {
        msgBox("This item is already in your cart!");
      } else {
        cart = cart + art + "=1;|";

        var itemCount = $("#itemCount").html();
        var qtaCount = $("#qtaCount").html();
        itemCount = parseInt(itemCount);
        qtaCount = parseInt(qtaCount);
        $("#itemCount").html(itemCount + 1);
        $("#qtaCount").html(qtaCount + 1);

        msgBox("Item added to cart!");
      }
      $.post("ajx_cart.asp", { cart: cart });
    });
  });

  //order submit ************************************************************************
  $("#btnSubmit").click(function (event) {
    event.preventDefault();
    $.MessageBox({
      buttonDone: "Yes, submit order.",
      buttonFail: "No, cancel order.",
      message: "You are about to submit your order. Are you sure?",
    })
      .done(function () {
        $("#frmSubmit").submit();
      })
      .fail(function () {
        return false;
      });
  });
})(jQuery);

function msgBox(testo) {
  if ($("#itemCount").is(":visible")) {
    $("#itemCount").LoadingOverlay("show", {
      background: "#FFFFFF",
      image: "",
      text: testo,
    });
    setTimeout(function () {
      $("#itemCount").LoadingOverlay("hide");
    }, 1500);
  } else {
    $.LoadingOverlay("show", {
      background: "#FFFFFF",
      image: "",
      text: testo,
    });
    setTimeout(function () {
      $.LoadingOverlay("hide");
    }, 1500);
  }
}

function getCookie(cookiename) {
  var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
  );
}

function changeImg(url) {
  document.getElementById("prod-img").src = url;
  document.getElementById("prod-link").href = url;
}

function login(formName) {
  var ok = true;
  var form = document.forms[formName];
  if (form.elements.user.value == "") {
    form.elements.user.style.color = "black";
    form.elements.user.placeholder = "required";
    if (formName == "frmLogin") {
      form.elements.user.style.borderColor = "black";
      form.elements.user.style.setProperty(
        "border-color",
        "black",
        "important"
      );
    }
    ok = false;
  }
  if (form.elements.pass.value == "") {
    form.elements.pass.style.color = "black";
    form.elements.pass.placeholder = "required";
    if (formName == "frmLogin") {
      form.elements.pass.style.borderColor = "black";
      form.elements.pass.style.setProperty(
        "border-color",
        "black",
        "important"
      );
    }
    ok = false;
  }
  if (ok == false) {
    return false;
  } else {
    return true;
  }
}

function contactForm(formname, response) {
  var form = $("#" + formname);
  var email = form.find('input[name="Email"]').val();

  if (!indirizzoemailvalido(email)) {
    $("#" + response).html(
      '<span style="color:red">Please check your email address, invalid format.</span>'
    );
    return false;
  } else {
    $(document).ajaxStart(function () {
      $("#ftco-loader").addClass("show");
    });
    $(document).ajaxComplete(function () {
      $("#ftco-loader").removeClass("show");
    });
    $.post("ajx_contactForm.asp", form.serialize(), function (result) {
      $("#" + response).html(result.substr(1));
      if (result.substr(0, 1) == 1) form.hide();
    });
  }
}

function indirizzoemailvalido(indirizzo) {
  if (window.RegExp) {
    var nonvalido = "(@.*@)|(\\.\\.)|(@\\.)|(\\.@)|(^\\.)";
    var valido =
      "^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$";
    var regnv = new RegExp(nonvalido);
    var regv = new RegExp(valido);
    if (!regnv.test(indirizzo) && regv.test(indirizzo)) return true;
    return false;
  } else {
    if (indirizzo.indexOf("@") >= 0) return true;
    return false;
  }
}

function changeColour(el, id, img, col) {
  event.preventDefault();
  var qs = $("#backQs").val();
  $("#" + id)
    .find(".imgart")
    .attr("src", "../dbcat/ImgCat/" + img);
  $("#" + id)
    .find(".artcol")
    .removeClass("selected");
  $(el).addClass("selected");
  $("#" + id)
    .find(".cod-prod")
    .attr("href", "product-single.asp?codart=" + id + "." + col + qs);
  $("#" + id)
    .find(".buy-now")
    .attr("href", "product-single.asp?codart=" + id + "." + col + qs);
  $("#" + id)
    .find(".add-to-cart")
    .attr("data-id", id + "." + col);
  $("#" + id)
    .find(".cod-prod")
    .html(id + "." + col);
  $("#" + id)
    .find(".img-prod")
    .attr("href", "product-single.asp?codart=" + id + "." + col + qs);
  $("#" + id)
    .find(".addToWishlist")
    .attr("data-id", id + "." + col);
}

function PreviewStampa(div, stampasubito) {
  if (typeof stampasubito == "undefined") var stampasubito = true;

  var display_setting = "toolbar=yes,location=no,directories=yes,menubar=yes,";
  display_setting += "scrollbars=yes,width=750, height=600, left=100, top=25";

  var document_print = window.open("", "Preview", display_setting);

  document_print.document.open();
  document_print.document.write("<html>");
  document_print.document.write("<head>");
  document_print.document.write(
    "<title>Magie Preziose | Really Made in Italy</title>"
  );

  document_print.document.write('<meta charset="utf-8">');
  //document_print.document.write('<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">');
  document_print.document.write(
    '<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800" rel="stylesheet">'
  );
  document_print.document.write('<link rel="stylesheet" href="css/style.css">');
  document_print.document.write(
    '<link rel="stylesheet" href="css/mpreziose_v3.css">'
  );
  document_print.document.write(
    '<link rel="stylesheet" href="css/print-v2.css">'
  );

  document_print.document.write("</head>");
  document_print.document.write("<body>");

  document_print.document.write(
    '<div style="width:730px; margin:0 auto; overflow:auto; position:absolute; left:50%; margin-left:-365px; top:0;">'
  );
  document_print.document.write('<div class="row articoli">');
  document_print.document.write(
    '<div class="col-12 logo-print"><img src="images/logo.png" /></div>'
  );
  document_print.document.write(document.getElementById(div).innerHTML);
  document_print.document.write("</div>");
  document_print.document.write("</div>");

  document_print.document.write("</body>");
  document_print.document.write("</html>");
  document_print.document.close();

  if (stampasubito == true) document_print.print();

  //	return false
}

function PrintPreview(query) {
  if (query == "wishlist" || query == "cart") {
    var url = "print-" + query + ".asp";
  } else {
    var url = "print-preview.asp?" + query;
  }

  var display_setting = "toolbar=yes,location=yes,directories=yes,menubar=yes,";
  display_setting += "scrollbars=yes,width=750, height=600, left=100, top=25";

  var preview = window.open(url, "Preview", display_setting);
  preview.focus();
}

<script>

function kerem_Alanlara_Deger_Girilince_Butonu_Ac() {

  // Normalde butonu serbest bırakmak istiyoruz
  kerem_Buton_Disable(false);

  // Bizi ilgilendiren radio değerlerini al
  var kerem_none = document.getElementById('cf-customfield_10902');

  // NONE seçildiyse, yıllık satış artışı zorunlu alandır
  if ( kerem_none.checked ) {
    var kerem_ysa = document.getElementById('customfield_10901');
    if (kerem_ysa.value == "") {
      kerem_Buton_Disable(true);
      return;
    }
  }

  // NONE seçildiyse, tasarruf / kazanç yöntemi zorunlu alandır
  if ( kerem_none.checked ) {
    var kerem_tky = document.getElementById('customfield_10908');
    if (kerem_tky.value == "") {
      kerem_Buton_Disable(true);
      return;
    }
  }

  // NONE hariç bir değer seçildiyse, açıklama zorunlu alandır
  if (!kerem_none.checked ) {
    var kerem_aci = document.getElementById('customfield_10906');
    if (kerem_aci.value == "") {
      kerem_Buton_Disable(true);
      return;
    }
  }

}

function kerem_Alanlara_Sayisal_Kontrol_Ekle() {

  // tasarruf
  var alan = document.getElementById('customfield_10900');
  alan.addEventListener("change", kerem_Sadece_Sayi_Girilsin, false);

  // yıllık satış artısı
  alan = document.getElementById('customfield_10901');
  alan.addEventListener("change", kerem_Sadece_Sayi_Girilsin, false);

}

function kerem_Alanlara_Zorunluluk_Ekle() {

  // Yıllık satış artışı
  var alan = document.getElementById('customfield_10901');
  alan.addEventListener("input", kerem_Alanlara_Deger_Girilince_Butonu_Ac);

  // Tasarruf / kazanç yöntemi
  alan = document.getElementById('customfield_10908');
  alan.addEventListener("input", kerem_Alanlara_Deger_Girilince_Butonu_Ac);

  // Açıklama (diğer)
  alan = document.getElementById('customfield_10906');
  alan.addEventListener("input", kerem_Alanlara_Deger_Girilince_Butonu_Ac);

}

function kerem_Buton_Disable(B) {
  var btn = document.getElementById('issue-workflow-transition-submit');
  btn.disabled = B;
}

function kerem_Aciklamayi_Giriste_Gizle() {
  document.getElementById('customfield_10907').style.display = 'none';
}

function kerem_Aciklama_Goster(B) {

  var target = document.getElementById('customfield_10906');

  if (B) {
    target.style.display = '';  
    target.placeholder="Lütfen giriş yapınız. SL onayı tuşu ancak o zaman aktive olacaktır.";
    //target.value = "";
    kerem_Buton_Disable(true);
  }
  else
  {
    target.style.display='none';
    kerem_Buton_Disable(false);
  }
}

function kerem_Handle(B) {

  var source = document.getElementById(B);

  console.log(source.value);

  // None

  if (source.value == '-1') {
    kerem_Aciklama_Goster(false);
  }

  // Yasal gereksinim

  if (source.value == '10900') {
    kerem_Aciklama_Goster(true);
  }

  // Diğer

  if (source.value == '10902') {
    kerem_Aciklama_Goster(true);
  }
  
  // Ortak
  kerem_Alanlara_Deger_Girilince_Butonu_Ac();

}

function kerem_Placeholder_Yaz() {

  var kerem_t1 = document.getElementById('customfield_10900');
  kerem_t1.placeholder = "Eğer bir iş gücü tasarrufu olacak ise, kişi*gün cinsinden yıllık tahmini değeri giriniz.";

  var kerem_t2 = document.getElementById('customfield_10901');
  kerem_t2.placeholder = "Yıllık satış artışı ya da maliyet tasarrufu sağlanıyor ise yıllık TL karşılığını giriniz.";

  var kerem_t3 = document.getElementById('customfield_10908');
  kerem_t3.placeholder = "İş gücü/maliyet tasarruf veya satış kazanç hesaplama yöntemini açıklayınız.";

}

function kerem_Radio_Ayarla() {

  var kerem_r0 = document.getElementById('cf-customfield_10902');
  kerem_r0.onclick = function () { kerem_Handle('cf-customfield_10902'); }

  var kerem_r1 = document.getElementById('customfield_10902-1');
  kerem_r1.onclick = function () { kerem_Handle('customfield_10902-1'); }

  var kerem_r2 = document.getElementById('customfield_10902-2');
  kerem_r2.onclick = function () { kerem_Handle('customfield_10902-2'); }


  kerem_r0.checked = true;

}

function kerem_Sadece_Sayi_Girilsin(e) {

  var target = e.target || e.srcElement;

  if (target.value.match(/^[0-9]+$/) != null) return;

  target.value = "";
  target.placeholder = "Sadece tamsayı girebilirsiniz";

  kerem_Alanlara_Deger_Girilince_Butonu_Ac();

}


kerem_Aciklama_Goster(false);
kerem_Radio_Ayarla();
kerem_Aciklamayi_Giriste_Gizle();
kerem_Alanlara_Zorunluluk_Ekle();
kerem_Alanlara_Sayisal_Kontrol_Ekle(); // IE'de çalışmıyor olabilir
kerem_Placeholder_Yaz();
kerem_Alanlara_Deger_Girilince_Butonu_Ac(); // Burada butonu kapatıyoruz aslında

</script>
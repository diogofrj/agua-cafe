from PIL import Image, ImageDraw, ImageFont

FD = "/home/claude/fonts/"
def zf(w, s):
    m = {"sb":"ZillaSlab-SemiBold.ttf","md":"ZillaSlab-Medium.ttf","rg":"ZillaSlab-Regular.ttf",
         "bd":"ZillaSlab-Bold.ttf","lt":"ZillaSlab-Light.ttf"}
    return ImageFont.truetype(FD+m[w], s)
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
def mf(s): return ImageFont.truetype(MONO, s)

def hx(h): h=h.lstrip("#"); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def mix(a,b,t): return tuple(round(a[i]+(b[i]-a[i])*t) for i in range(3))

PAPER=hx("F4EEE2"); INK=hx("2B211A"); MUT=hx("6E6053"); LIGHT=hx("F7F2E8")

W,H = 720,1080

DATA = [
  dict(key="mg", name="Magnésio", cat="Dureza", color=hx("1E6F8E"),
       grams="12,32", func="Doçura + acidez",
       formula=[("MgSO",0),("4",1),("·7H",0),("2",1),("O",0)]),
  dict(key="ca", name="Cálcio", cat="Dureza", color=hx("3F7D43"),
       grams="7,35", func="Corpo · estrutura",
       formula=[("CaCl",0),("2",1),("·2H",0),("2",1),("O",0)]),
  dict(key="na", name="Sódio", cat="Alcalinidade", color=hx("C07A2B"),
       grams="4,20", func="Corpo · buffer redondo",
       formula=[("NaHCO",0),("3",1)]),
  dict(key="k", name="Potássio", cat="Alcalinidade", color=hx("B0463A"),
       grams="5,01", func="Buffer limpo",
       formula=[("KHCO",0),("3",1)]),
]

def tracked(draw, txt, font, fill, cx, y, track):
    widths=[draw.textlength(c,font=font) for c in txt]
    total=sum(widths)+track*(len(txt)-1)
    x=cx-total/2
    for c,w in zip(txt,widths):
        draw.text((x,y),c,font=font,fill=fill); x+=w+track

def formula(draw, tokens, cx, cy, fmain, fsub, fill):
    parts=[]; total=0
    for t,sub in tokens:
        f=fsub if sub else fmain
        w=draw.textlength(t,font=f); parts.append((t,sub,f,w)); total+=w
    x=cx-total/2
    for t,sub,f,w in parts:
        yy=cy+(12 if sub else 0)
        draw.text((x,yy),t,font=f,fill=fill); x+=w

def make(d):
    img=Image.new("RGB",(W,H),PAPER); dr=ImageDraw.Draw(img)
    col=d["color"]; coldark=mix(col,(0,0,0),0.38); coltint=mix(col,PAPER,0.84)

    # header band
    HB=210
    dr.rectangle([0,0,W,HB],fill=col)
    tracked(dr,d["cat"].upper(),mf(20),mix(col,LIGHT,0.78),W/2,40,8)
    nf=zf("sb",76); dr.text((W/2,118),d["name"],font=nf,fill=LIGHT,anchor="mm")

    # formula
    formula(dr,d["formula"],W/2,262,mf(34),mf(24),MUT)

    # divider
    dr.line([W/2-46,330,W/2+46,330],fill=col,width=3)

    # recipe
    tracked(dr,"RECEITA · 100 mL",mf(19),MUT,W/2,372,6)
    gf=zf("bd",132)
    gw=dr.textlength(d["grams"],font=gf)
    uf=zf("md",46); uw=dr.textlength(" g",font=uf)
    startx=W/2-(gw+uw)/2
    dr.text((startx,420),d["grams"],font=gf,fill=INK)
    dr.text((startx+gw,486),"g",font=uf,fill=col)

    dr.text((W/2,604),"dissolver em água destilada",font=zf("rg",30),fill=MUT,anchor="mm")
    dr.text((W/2,644),"e completar até a marca de 100 mL",font=zf("rg",30),fill=MUT,anchor="mm")

    # function pill
    pf=zf("md",34); pw=dr.textlength(d["func"],font=pf)
    ph=64; px=W/2-pw/2-34; py=730
    dr.rounded_rectangle([px,py,W/2+pw/2+34,py+ph],radius=ph/2,fill=coltint)
    dr.text((W/2,py+ph/2),d["func"],font=pf,fill=coldark,anchor="mm")

    # footer
    dr.line([60,H-118,W-60,H-118],fill=mix(INK,PAPER,0.78),width=2)
    tracked(dr,"SOLUÇÃO 0,5 mol/L · GOTA 0,062 mL",mf(20),MUT,W/2,H-92,3)
    dr.text((W/2,H-54),"água destilada / osmose · café",font=zf("rg",24),fill=mix(MUT,PAPER,0.25),anchor="mm")

    # trim border
    dr.rectangle([12,12,W-13,H-13],outline=mix(INK,PAPER,0.55),width=2)

    p=f"/home/claude/etiqueta_{d['key']}.png"
    img.save(p,dpi=(300,300)); return p

for d in DATA:
    print(make(d))

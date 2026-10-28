from pathlib import Path
import json,csv,io
R=Path(__file__).resolve().parent.parent/'foundations'
_raw=json.loads((R/'sis-ejust-palette.tokens.json').read_text())
_ext=_raw.get('$extensions',{})
def _legacy(doc):
 primitives={family:{step:token['$value'] for step,token in steps.items()} for family,steps in doc['ref']['color'].items()}
 themes={}
 for theme,roles in doc['sys']['color'].items():
  themes[theme]={role:token['$value'][len('{ref.color.'):-1] for role,token in roles.items()}
 return {'metadata':_ext.get('sis.metadata'),'primitives':primitives,'themes':themes,'components':_ext.get('sis.componentAliases'),'semantic':_ext.get('sis.semantic')}
source=_legacy(_raw)
p=source['primitives']
light=source['themes']['light']
dark=source['themes']['dark']
component=source['components']
keys=list(p['brand'])
assert light.keys()==dark.keys()
def value(ref):
 a,b=ref.split('.');return p[a][b]
def lum(h):
 cs=[int(h[i:i+2],16)/255 for i in (1,3,5)]
 return sum((c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4)*w for c,w in zip(cs,[.2126,.7152,.0722]))
def contrast(a,b):
 lo,hi=sorted([lum(a),lum(b)]);return (hi+.05)/(lo+.05)
checks=[]
def check(theme,fg,bg,minimum):
 roles={'light':light,'dark':dark}[theme];a=value(roles[fg]);b=value(roles[bg]);r=contrast(a,b)
 checks.append(dict(theme=theme,foregroundToken=fg,backgroundToken=bg,foreground=a,background=b,ratio=r,minimum=minimum,passed=r>=minimum))
for theme in ['light','dark']:
 for fg in ['text-primary','text-secondary','text-muted','text-placeholder','text-brand','icon-default','icon-muted']:
  for bg in ['bg-canvas','bg-surface','bg-raised','bg-subtle','bg-selected']:check(theme,fg,bg,4.5 if fg.startswith('text') else 3)
 for fg in ['link-default','link-hover','link-visited']:
  for bg in ['bg-canvas','bg-surface','bg-raised','bg-subtle']:check(theme,fg,bg,4.5)
 for bg in ['action-primary-bg','action-primary-hover','action-primary-pressed']:check(theme,'action-primary-fg',bg,4.5)
 for bg in ['action-secondary-bg','action-secondary-hover','action-secondary-pressed']:check(theme,'action-secondary-fg',bg,4.5)
 for bg in ['action-ghost-bg','action-ghost-hover','action-ghost-pressed']:check(theme,'action-ghost-fg',bg,4.5)
 for fg,bg in [('text-on-inverse','bg-inverse'),('action-disabled-fg','action-disabled-bg'),('nav-text','nav-bg'),('nav-selected-text','nav-selected-bg'),('input-fg','input-bg'),('input-placeholder','input-bg'),('input-disabled-fg','input-disabled-bg'),('input-readonly-fg','input-readonly-bg'),('input-invalid-text','input-invalid-bg'),('table-header-text','table-header-bg'),('tooltip-text','tooltip-bg'),('selection-text','selection-bg'),('control-checked-mark','control-checked-bg')]:check(theme,fg,bg,4.5)
 for bg in ['table-row-bg','table-row-alternate-bg','table-row-hover-bg','table-row-selected-bg']:check(theme,'table-text',bg,4.5)
 for bg in ['bg-canvas','bg-surface','bg-raised','bg-subtle','bg-selected']:
  for fg in ['focus-ring','border-control','nav-selected-indicator','action-primary-border','action-primary-border-hover','action-primary-border-pressed','destructive-border','destructive-border-hover','destructive-border-pressed']:check(theme,fg,bg,3)
 for fg,bg in [('input-border','input-bg'),('input-hover-border','input-bg'),('input-focus-border','input-bg'),('input-invalid-border','input-invalid-bg'),('control-unchecked-border','control-unchecked-bg'),('control-checked-border','control-unchecked-bg'),('nav-selected-icon','nav-selected-bg'),('nav-icon','nav-bg')]:check(theme,fg,bg,3)
 for state in ['success','warning','danger','info']:
  for bg in [f'{state}-bg',f'{state}-tint']:
   check(theme,f'{state}-text',bg,4.5)
   check(theme,f'{state}-icon',bg,3)
   check(theme,f'{state}-border',bg,3)
 for bg in ['destructive-bg','destructive-hover','destructive-pressed']:check(theme,'destructive-fg',bg,4.5)
 for i in range(1,9):
  for bg in ['bg-surface','bg-raised']:check(theme,f'chart-{i}',bg,3)
fail=[c for c in checks if not c['passed']]
if fail:
 print(json.dumps(fail,indent=2));raise SystemExit(1)
meta=dict(name='SIS E-JUST color system',version=2,date='2026-10-27',status='Proposed values; final foundation visual review pending',brandSource='Adham supplied #EA232B',brand='ejust',themes=['light','dark'],themePreferences=['light','dark','system'],primitiveTokenCount=sum(map(len,p.values())),uniqueSolidColorCount=len({v for family in p.values() for v in family.values()}),semanticRolesPerTheme=len(light),componentAliasCount=len(component),contrastCheckCount=len(checks))
semantic={k:{'reference':v,'hex':value(v)} for k,v in light.items()}
dtcg={'$description':'SIS E-JUST color system. W3C design tokens format. Metadata, component aliases, and the derived light-theme lookup live under $extensions.',
 '$extensions':{'sis.metadata':meta,'sis.componentAliases':component,'sis.semantic':semantic},
 'ref':{'color':{family:{step:{'$type':'color','$value':hexv} for step,hexv in vals.items()} for family,vals in p.items()}},
 'sys':{'color':{theme:{role:{'$type':'color','$value':'{ref.color.'+alias.split('.')[0]+'.'+alias.split('.')[1]+'}'} for role,alias in roles.items()} for theme,roles in {'light':light,'dark':dark}.items()}}}
(R/'sis-ejust-palette.tokens.json').write_text(json.dumps(dtcg,indent=2,ensure_ascii=False)+'\n')
# Reference values stay independent of theme. Semantic and component aliases redeclare together for nested theme scopes.
css=[':root {']
for family,vals in p.items():
 for k,v in vals.items():css.append(f'  --ref-color-{family}-{k}: {v};')
css+=['}',':root, [data-brand="ejust"] {']
for k in keys:css.append(f'  --brand-{k}: var(--ref-color-brand-{k});')
css+=['}']
def block(selector,theme):
 lines=[selector+' {',f'  color-scheme: {theme};']
 for k,v in source['themes'][theme].items():
  family,step=v.split('.');ref=f'--brand-{step}' if family=='brand' else f'--ref-color-{family}-{step}'
  lines.append(f'  --sys-color-{k}: var({ref});')
 for k,v in component.items():lines.append(f'  --cmp-{k}: var(--sys-color-{v});')
 # Preserve prior prototype variable names, including primitive access for migration.
 for family,vals in p.items():
  for k in vals:
   ref=f'--brand-{k}' if family=='brand' else f'--ref-color-{family}-{k}'
   lines.append(f'  --color-{family}-{k}: var({ref});')
 lines.append('  --color-chart-violet: var(--ref-color-violet-700);')
 for k in light:lines.append(f'  --color-{k}: var(--sys-color-{k});')
 lines+=['  --effect-dialog-backdrop: rgb(9 9 11 / '+('0.40' if theme=='light' else '0.72')+');',
 '  --effect-shadow-raised: 0 4px 16px rgb(9 9 11 / '+('0.12' if theme=='light' else '0.40')+');',
 '  --sys-shadow-flat: none;',
 '  --sys-shadow-low: 0 4px 16px 0 rgb(9 9 11 / '+('0.12' if theme=='light' else '0.40')+');',
 '  --sys-shadow-high: 0 8px 24px 0 rgb(9 9 11 / '+('0.16' if theme=='light' else '0.48')+');','}']
 return '\n'.join(lines)
css += [block(':root, [data-theme="light"], [data-theme="system"], [data-theme="ejust-light"]','light'),block('[data-theme="dark"], [data-theme="ejust-dark"]','dark'), '@media (prefers-color-scheme: dark) {',block('[data-theme="system"]','dark'),'}']
# Export each mode as a standalone Design Tokens Community Group 2025.10-format token document.
f=io.StringIO();w=csv.writer(f);w.writerow(['Figma variable','Light reference','Light hex','Dark reference','Dark hex'])
for k in light:w.writerow(['color/'+k.replace('-','/'),light[k],value(light[k]),dark[k],value(dark[k])])
(R/'sis-ejust-palette.contrast.json').write_text(json.dumps({'metadata':meta,'method':'WCAG relative luminance; unrounded values decide pass; solid sRGB colors only','checks':checks,'excludedPair':{'foreground':'#FFFFFF','background':'#EA232B','ratio':contrast('#FFFFFF','#EA232B'),'passesNormalText':False}},indent=2)+'\n')
print(json.dumps(meta,indent=2))

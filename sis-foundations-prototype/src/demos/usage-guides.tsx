import {useState} from 'react';
import {Copy,Download,BookOpen}from'lucide-react';
import{Panel,Button,Badge,ModalExample,copyText,tr,type DemoProps}from'../shared';
import guide from'../data/usage.json';
import './usage-guides.css';
export function UsageGuides({kind,...props}:DemoProps&{kind:'spacing'|'radius'|'icons'}){
 const [opened,setOpened]=useState<string|null>(null);const t=(en:string,ar:string)=>tr(props.locale,en,ar,en);
 const entries=guide[kind];
 return <Panel className="usage-guide-panel" title={<span data-specimen={`${kind}-usage-guide`}>{t('Where each value belongs','أين تستخدم كل قيمة')}</span>}>
  <p>{t('Choose a token by its purpose. Each value has a concrete example and a misuse rule.','اختر الرمز وفق غرضه. لكل قيمة مثال محدد وقاعدة تمنع سوء الاستخدام.')}</p>
  <div className="usage-guides">{entries.map(entry=><article className="usage-row" key={entry.token} data-usage-value={String(entry.value)}>
   <div><h4>{entry.title[props.locale]}</h4><code>{entry.token} · {entry.value}{typeof entry.value==='number'?'px':''}</code><p>{entry.use[props.locale]}</p><p className="muted">{t('Avoid','تجنب')}: {entry.avoid[props.locale]}</p>
   <Button variant="ghost" onClick={()=>copyText(`var(${entry.token})`,props.notify,props.locale)}><Copy size={16}/>{t('Copy token','نسخ الرمز')}</Button></div>
   {kind==='spacing'?<div className="usage-preview"><div className={Number(entry.value)>=16?'usage-padding':'usage-gap'} style={Number(entry.value)>=16?{padding:`var(${entry.token})`}:{gap:`var(${entry.token})`}}><span>{t('Label','تسمية')}</span><span>{Number(entry.value)>=16?t('Content','المحتوى'):t('Related content','محتوى مرتبط')}</span></div><small>{entry.value}px {Number(entry.value)>=16?t('padding','حشو'):t('gap','فجوة')}</small></div>:kind==='radius'?<div className="usage-preview"><div className="usage-corner" style={{borderRadius:`var(${entry.token})`}}>{entry.token.endsWith('avatar')?'AH':t('Surface','سطح')}</div>{entry.value===8&&<Button variant="secondary" onClick={()=>setOpened(entry.title[props.locale])}>{t('Open control example','فتح مثال التحكم')}</Button>}</div>:<div className="usage-preview"><div className="row"><BookOpen size={Number(entry.value)}/><span>{t('Course details','تفاصيل المقرر')}</span></div><Button variant="secondary" aria-label={`${t('Download sample at','تنزيل مثال بحجم')} ${entry.value}px`} onClick={()=>{setOpened(`${entry.value}px`);props.notify(t('Icon action confirmed locally','تم تأكيد إجراء الأيقونة محلياً'),'success');}}><Download size={Number(entry.value)}/></Button><small>{t('Visible icon','أيقونة ظاهرة')}: {entry.value}px · {t('Target','منطقة التفاعل')}: 44px+</small></div>}
  </article>)}</div>
  {kind==='spacing'&&<div className="result-box"><strong>{t('Density follows the task','الكثافة تتبع المهمة')}</strong><p>{t('Comfortable suits reading and touch. Compact suits dense staff work. A user override takes precedence. Both keep readable text and 44px targets.','الكثافة المريحة مناسبة للقراءة واللمس. المدمجة مناسبة للعمل الإداري الكثيف. اختيار المستخدم له الأولوية. تحافظ الحالتان على النص الواضح ومناطق تفاعل 44px.')}</p></div>}
  <ModalExample open={opened!==null} onClose={()=>setOpened(null)} title={t('Usage example confirmed','تم تأكيد مثال الاستخدام')} locale={props.locale}><p>{opened}</p><Badge tone="success">{t('Local example only','مثال محلي فقط')}</Badge></ModalExample>
 </Panel>;
}

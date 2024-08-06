import {gsap} from "gsap"
import {ScrollTrigger} from "gsap/all"
gsap.registerPlugin(ScrollTrigger)
export default function animation(item,items,scrollTrigger,from,to){
    if(scrollTrigger){
        if(item){
            gsap.from(item,{
                ...from,
                stagger:.25,
                scrollTrigger:{
                    trigger:item,
                }
            })
            gsap.to(item,{
                ...to,
                stagger:.25,
                scrollTrigger:{
                    trigger:item,
                }
            })
        }
        if(items){
            items.forEach(element => {
                gsap.from(element,{
                    ...from,
                    stagger:.25,
                    scrollTrigger:{
                        trigger:element,
                    }
                })
                gsap.to(element,{
                    ...to,
                    stagger:.25,
                    scrollTrigger:{
                        trigger:element,
                    }
                })
            });
        }
    }
}
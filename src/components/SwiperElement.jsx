import {Swiper,SwiperSlide} from "swiper/react";
import {Pagination,Parallax,Scrollbar,A11y,Autoplay, EffectCoverflow} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import ChatIcon from "../icons/ChatIcon";
import EncryptionIcon from "../icons/EncryptionIcon";
import FileIcon from "../icons/FileIcon";
import GroupChatIcon from "../icons/GroupChatIcon";
import MessageIcon from "../icons/MessageIcon";
import MessageSentIcon from "../icons/MessageSentIcon";
export default function SwiperElement() {
    return (
        <Swiper
            scrollbar={{draggable: false}}
            effect="coverflow"
            modules={[Pagination,Parallax,Scrollbar,A11y,Autoplay,EffectCoverflow]}
            slidesPerView={1}
            centeredSlides={true}
            pagination={{clickable:true,dynamicBullets:true,dynamicMainBullets:true}}
            style={{width:"100%",height:"400px"}}
            grabCursor={true}
            autoplay={{
                delay:3000,
                disableOnInteraction:false,
            }}
        >
            <SwiperSlide style={{display:"grid",placeItems:"center",height:"100%",width:"100%"}}><ChatIcon/></SwiperSlide>
            <SwiperSlide style={{display:"grid",placeItems:"center",height:"100%",width:"100%"}}><EncryptionIcon/></SwiperSlide>
            <SwiperSlide style={{display:"grid",placeItems:"center",height:"100%",width:"100%"}}><FileIcon/></SwiperSlide>
            <SwiperSlide style={{display:"grid",placeItems:"center",height:"100%",width:"100%"}}><GroupChatIcon/></SwiperSlide>
            <SwiperSlide style={{display:"grid",placeItems:"center",height:"100%",width:"100%"}}><MessageIcon/></SwiperSlide>
            <SwiperSlide style={{display:"grid",placeItems:"center",height:"100%",width:"100%"}}><MessageSentIcon/></SwiperSlide>
        </Swiper>
    )
}

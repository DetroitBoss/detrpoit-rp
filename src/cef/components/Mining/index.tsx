import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './styles.less'
import {CEF} from '../../modules/CEF';
import {CustomEventHandler} from "../../../shared/custom.event";
import {SocketSync} from "../SocketSync";
import {
    calculateMiningFarmData,
    getMiningLevel, MINING_ALGORITHMS_LEVELS, MINING_CPUS,
    MINING_POWERSS, MINING_RAMS,
    MINING_VIDEOCARDS,
    MiningHouseDefault,
    MiningHouseItemData
} from "../../../shared/mining";
import png from './styles/assets/images/*.png'
import svg from './styles/assets/images/*.svg'
import {system} from "../../modules/system";
import iconsItems from '../../../shared/icons/*.png';
let stats = {
    amount: ["Заработано", ""],
    profit: ["КПД", "%"],
    tf: ["Производительность", "TF"],
    cpu: ["CPU", "mHz"],
    ram: ["RAM", "MB"],
    power: ["Питание", "W"],
}

let upgradeNames = {
    videocards: ['Видеокарты', <svg
        width="32"
        height="26"
        className="title-icon-svg"
        viewBox="0 0 32 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            className="tile-icon-fill"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.22124 21.5983H30.6774C31.4079 21.5983 32.0002 21.0061 32.0002 20.2755V4.40185C32.0002 3.67128 31.4079 3.07904 30.6774 3.07904H4.22124C3.49068 3.07904 2.89844 3.67128 2.89844 4.40185V20.2755C2.89844 21.0061 3.49068 21.5983 4.22124 21.5983ZM5.54405 5.72465H29.3546V18.9527H5.54405V5.72465Z"
            fill="white"
        />
        <path
            className="tile-icon-fill"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.8983 3.07896V22.9211C2.8983 23.6516 3.49054 24.2439 4.22111 24.2439C4.95167 24.2439 5.54391 23.6516 5.54391 22.9211V1.75615C5.54391 1.02558 4.95167 0.433342 4.22111 0.433342H1.57549C0.844926 0.433342 0.252686 1.02558 0.252686 1.75615C0.252686 2.48672 0.844926 3.07896 1.57549 3.07896H2.8983Z"
            fill="white"
        />
        <path
            className="tile-icon-fill"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M25.3861 12.3387C25.3861 13.8 24.2018 14.9843 22.7404 14.9843C21.2791 14.9843 20.0948 13.8 20.0948 12.3387C20.0948 10.8773 21.2791 9.69304 22.7404 9.69304C24.2018 9.69304 25.3861 10.8773 25.3861 12.3387ZM28.0317 12.3387C28.0317 9.41619 25.6629 7.04742 22.7404 7.04742C19.818 7.04742 17.4492 9.41619 17.4492 12.3387C17.4492 15.2611 19.818 17.6299 22.7404 17.6299C25.6629 17.6299 28.0317 15.2611 28.0317 12.3387Z"
            fill="white"
        />
        <path
            className="tile-icon-fill"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.4807 14.9843H12.1579C10.6966 14.9843 9.51231 13.8 9.51231 12.3387C9.51231 10.8773 10.6966 9.69304 12.1579 9.69304H13.4807V14.9843ZM12.1579 17.6299H14.8035C15.5341 17.6299 16.1263 17.0376 16.1263 16.3071V8.37023C16.1263 7.63967 15.5341 7.04742 14.8035 7.04742H12.1579C9.23547 7.04742 6.8667 9.41619 6.8667 12.3387C6.8667 15.2611 9.23547 17.6299 12.1579 17.6299Z"
            fill="white"
        />
        <path
            className="tile-icon-fill"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.18945 20.2755V24.2439C8.18945 24.9745 8.78169 25.5667 9.51226 25.5667C10.2428 25.5667 10.8351 24.9745 10.8351 24.2439V20.2755C10.8351 19.5449 10.2428 18.9527 9.51226 18.9527C8.78169 18.9527 8.18945 19.5449 8.18945 20.2755Z"
            fill="white"
        />
        <path
            className="tile-icon-fill"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.4807 20.2755V24.2439C13.4807 24.9745 14.073 25.5667 14.8035 25.5667C15.5341 25.5667 16.1263 24.9745 16.1263 24.2439V20.2755C16.1263 19.5449 15.5341 18.9527 14.8035 18.9527C14.073 18.9527 13.4807 19.5449 13.4807 20.2755Z"
            fill="white"
        />
        <path
            className="tile-icon-fill"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.772 20.2755V24.2439C18.772 24.9745 19.3642 25.5667 20.0948 25.5667C20.8253 25.5667 21.4176 24.9745 21.4176 24.2439V20.2755C21.4176 19.5449 20.8253 18.9527 20.0948 18.9527C19.3642 18.9527 18.772 19.5449 18.772 20.2755Z"
            fill="white"
        />
    </svg>, 'RTX-3080', MINING_VIDEOCARDS.map(q => q.item)],
    cpu: ['CPU', <svg
        width="32"
        height="32"
        className="title-icon-svg"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M28.2692 29.3333H11.7304C11.1428 29.3333 10.6664 28.8569 10.6664 28.2693V7.89191C10.6664 7.21495 11.2148 6.66657 11.8918 6.66657H28.1078C28.7848 6.66657 29.3332 7.21495 29.3332 7.89191V28.2693C29.3332 28.8569 28.8568 29.3333 28.2692 29.3333ZM28.2692 32C30.3296 32 31.9999 30.3297 31.9999 28.2693V7.89191C31.9999 5.74219 30.2576 3.99989 28.1078 3.99989H11.8918C9.74205 3.99989 7.99976 5.74219 7.99976 7.89191V28.2693C7.99976 30.3297 9.67005 32 11.7304 32H28.2692Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.6667 7.89191C10.6667 7.21495 11.2151 6.66657 11.892 6.66657H24.0001V3.89189C24.0001 1.74217 22.2578 -0.00012207 20.1081 -0.00012207H3.89202C1.74229 -0.00012207 0 1.74217 0 3.89189V25.6026C0 27.663 1.67029 29.3333 3.73068 29.3333H10.6667V7.89191ZM3.73068 26.6667C3.14306 26.6667 2.66668 26.1903 2.66668 25.6026V3.89189C2.66668 3.21494 3.21506 2.66656 3.89202 2.66656H20.1081C20.785 2.66656 21.3334 3.21494 21.3334 3.89189V3.99989H11.892C9.74233 3.99989 8.00003 5.74219 8.00003 7.89191V26.6667H3.73068Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24.0002 20.0001C24.0002 22.2091 22.2092 24.0001 20.0002 24.0001C17.7912 24.0001 16.0002 22.2091 16.0002 20.0001C16.0002 17.7912 17.7912 16.0001 20.0002 16.0001C22.2092 16.0001 24.0002 17.7912 24.0002 20.0001ZM26.6669 20.0001C26.6669 16.3184 23.6819 13.3334 20.0002 13.3334C16.3185 13.3334 13.3335 16.3184 13.3335 20.0001C13.3335 23.6818 16.3185 26.6668 20.0002 26.6668C23.6819 26.6668 26.6669 23.6818 26.6669 20.0001Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.4247 16.5478L19.0156 16.1413C19.3864 16.0465 19.7022 16.0001 20.0002 16.0001C21.6324 16.0001 23.0805 16.9882 23.6947 18.4736L24.3243 19.9963L25.6822 19.0629C27.1205 18.0742 28.0002 16.444 28.0002 14.6668C28.0002 11.721 25.6126 9.33341 22.6669 9.33341C19.7211 9.33341 17.3335 11.721 17.3335 14.6668C17.3335 14.7752 17.3429 14.8674 17.3552 14.9475L17.4247 16.5478ZM22.6669 12.0001C24.1398 12.0001 25.3335 13.1938 25.3335 14.6668C25.3335 15.0389 25.2565 15.3979 25.1138 15.726C23.9476 14.3296 22.2363 13.4413 20.3515 13.3426C20.8113 12.5404 21.6759 12.0001 22.6669 12.0001Z"
            fill="white"
        />
    </svg>, 'RTX-3080', MINING_CPUS.map(q => q.item)],
    powers: ['Блоки питания', <svg
        width="24"
        height="32"
        className="title-icon-svg"
        viewBox="0 0 24 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.3333 17.3333C17.3333 18.0703 16.737 18.6667 16 18.6667C15.263 18.6667 14.6667 18.0703 14.6667 17.3333C14.6667 16.5964 15.263 16 16 16C16.737 16 17.3333 16.5964 17.3333 17.3333ZM20 17.3333C20 15.1236 18.2097 13.3333 16 13.3333C13.7903 13.3333 12 15.1236 12 17.3333C12 19.543 13.7903 21.3333 16 21.3333C18.2097 21.3333 20 19.543 20 17.3333Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.33333 32H22.6667C23.403 32 24 31.403 24 30.6667V1.33333C24 0.596946 23.403 -7.62939e-06 22.6667 -7.62939e-06H1.33333C0.596954 -7.62939e-06 0 0.596946 0 1.33333V30.6667C0 31.403 0.596954 32 1.33333 32ZM2.66667 2.66666H21.3333V29.3333H2.66667V2.66666Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.33333 12H18.6667C19.403 12 20 11.403 20 10.6667V5.33333C20 4.59695 19.403 3.99999 18.6667 3.99999H5.33333C4.59695 3.99999 4 4.59695 4 5.33333V10.6667C4 11.403 4.59695 12 5.33333 12ZM6.66667 6.66666H17.3333V9.33333H6.66667V6.66666Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.66659 26.6667H17.3333C18.0696 26.6667 18.6666 26.0697 18.6666 25.3333C18.6666 24.5969 18.0696 24 17.3333 24H6.66659C5.93021 24 5.33325 24.5969 5.33325 25.3333C5.33325 26.0697 5.93021 26.6667 6.66659 26.6667Z"
            fill="white"
        />
    </svg>, 'CORSAIR-CX750', MINING_POWERSS.map(q => q.item)],
    alghoritm: ['Програмное обеспечение', <svg
        width="32"
        height="32"
        className="title-icon-svg"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.6668 22.6667H21.3336C22.07 22.6667 22.667 22.0698 22.667 21.3334V10.6666C22.667 9.93021 22.07 9.33325 21.3336 9.33325H10.6668C9.93046 9.33325 9.3335 9.93021 9.3335 10.6666V21.3334C9.3335 22.0698 9.93046 22.6667 10.6668 22.6667ZM12.0002 20V11.9999H20.0003V20H12.0002Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.6667 8.00009V10.6668H1.33335C0.59696 10.6668 0 11.2637 0 12.0001V28.3923C0 30.3851 1.61597 32.0004 3.60937 32.0004H20.0002C20.7366 32.0004 21.3336 31.4034 21.3336 30.667C21.3336 29.8419 21.7288 29.3337 22.6669 29.3337C23.6058 29.3337 24.0003 29.8411 24.0003 30.667C24.0003 31.4034 24.5972 32.0004 25.3336 32.0004H28.3923C30.3847 32.0004 32.0004 30.3847 32.0004 28.3923V3.60804C32.0004 1.61564 30.3847 0 28.3923 0H25.3336C24.5972 0 24.0003 0.59696 24.0003 1.33335C24.0003 2.03623 23.4769 2.6667 22.6669 2.6667C21.7764 2.6667 21.3336 2.11125 21.3336 1.33335C21.3336 0.59696 20.7366 0 20.0002 0H3.60937C1.61597 0 0 1.61531 0 3.60804V6.66674C0 7.40313 0.59696 8.00009 1.33335 8.00009H2.6667ZM22.6669 26.667C20.6406 26.667 19.3287 27.796 18.8598 29.3337H3.60937C3.0885 29.3337 2.6667 28.912 2.6667 28.3923V13.3335H4.00005C4.73643 13.3335 5.33339 12.7365 5.33339 12.0001V6.66674C5.33339 5.93036 4.73643 5.33339 4.00005 5.33339H2.6667V3.60804C2.6667 3.08833 3.0885 2.6667 3.60937 2.6667H18.8716C19.3594 4.18883 20.6984 5.33339 22.6669 5.33339C24.5405 5.33339 25.9234 4.16548 26.4424 2.6667H28.3923C28.912 2.6667 29.3337 3.08842 29.3337 3.60804V28.3923C29.3337 28.912 28.912 29.3337 28.3923 29.3337H26.4742C26.0056 27.7957 24.6942 26.667 22.6669 26.667Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.3337 10.6666V6.66657C17.3337 5.93018 16.7367 5.33322 16.0003 5.33322C15.264 5.33322 14.667 5.93018 14.667 6.66657V10.6666C14.667 11.403 15.264 12 16.0003 12C16.7367 12 17.3337 11.403 17.3337 10.6666Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M22.6669 10.6666V7.99991C22.6669 7.26353 22.07 6.66656 21.3336 6.66656C20.5972 6.66656 20.0002 7.26353 20.0002 7.99991V10.6666C20.0002 11.403 20.5972 12 21.3336 12C22.07 12 22.6669 11.403 22.6669 10.6666Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.0002 10.6666V7.99991C12.0002 7.26353 11.4032 6.66656 10.6668 6.66656C9.93046 6.66656 9.3335 7.26353 9.3335 7.99991V10.6666C9.3335 11.403 9.93046 12 10.6668 12C11.4032 12 12.0002 11.403 12.0002 10.6666Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.3337 25.3335V21.3334C17.3337 20.597 16.7367 20.0001 16.0003 20.0001C15.264 20.0001 14.667 20.597 14.667 21.3334V25.3335C14.667 26.0698 15.264 26.6668 16.0003 26.6668C16.7367 26.6668 17.3337 26.0698 17.3337 25.3335Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M22.6669 24.0001V21.3334C22.6669 20.597 22.07 20.0001 21.3336 20.0001C20.5972 20.0001 20.0002 20.597 20.0002 21.3334V24.0001C20.0002 24.7365 20.5972 25.3335 21.3336 25.3335C22.07 25.3335 22.6669 24.7365 22.6669 24.0001Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.0002 24.0001V21.3334C12.0002 20.597 11.4032 20.0001 10.6668 20.0001C9.93046 20.0001 9.3335 20.597 9.3335 21.3334V24.0001C9.3335 24.7365 9.93046 25.3335 10.6668 25.3335C11.4032 25.3335 12.0002 24.7365 12.0002 24.0001Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M21.3336 17.3334H25.3336C26.07 17.3334 26.667 16.7364 26.667 16C26.667 15.2636 26.07 14.6667 25.3336 14.6667H21.3336C20.5972 14.6667 20.0002 15.2636 20.0002 16C20.0002 16.7364 20.5972 17.3334 21.3336 17.3334Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M21.3336 22.6668H24.0003C24.7367 22.6668 25.3336 22.0698 25.3336 21.3334C25.3336 20.597 24.7367 20.0001 24.0003 20.0001H21.3336C20.5972 20.0001 20.0002 20.597 20.0002 21.3334C20.0002 22.0698 20.5972 22.6668 21.3336 22.6668Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M21.3336 11.9999H24.0003C24.7367 11.9999 25.3336 11.403 25.3336 10.6666C25.3336 9.93021 24.7367 9.33325 24.0003 9.33325H21.3336C20.5972 9.33325 20.0002 9.93021 20.0002 10.6666C20.0002 11.403 20.5972 11.9999 21.3336 11.9999Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.66684 17.3334H10.6669C11.4033 17.3334 12.0002 16.7364 12.0002 16C12.0002 15.2636 11.4033 14.6667 10.6669 14.6667H6.66684C5.93046 14.6667 5.3335 15.2636 5.3335 16C5.3335 16.7364 5.93046 17.3334 6.66684 17.3334Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.0001 22.6668H10.6668C11.4032 22.6668 12.0001 22.0698 12.0001 21.3334C12.0001 20.597 11.4032 20.0001 10.6668 20.0001H8.0001C7.26371 20.0001 6.66675 20.597 6.66675 21.3334C6.66675 22.0698 7.26371 22.6668 8.0001 22.6668Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.0001 11.9999H10.6668C11.4032 11.9999 12.0001 11.403 12.0001 10.6666C12.0001 9.93021 11.4032 9.33325 10.6668 9.33325H8.0001C7.26371 9.33325 6.66675 9.93021 6.66675 10.6666C6.66675 11.403 7.26371 11.9999 8.0001 11.9999Z"
            fill="white"
        />
    </svg>, 'CORSAIR-CX750', MINING_ALGORITHMS_LEVELS.map(q => q.item)],
    rams: ['Оперативная память', <svg
        width="32"
        height="15"
        className="title-icon-svg"
        viewBox="0 0 32 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M28.7129 11.9998H3.28528C2.94354 11.9998 2.66663 11.7227 2.66663 11.3799V3.28665C2.66663 2.94383 2.94354 2.66666 3.28528 2.66666H28.7129C29.0552 2.66666 29.3329 2.94437 29.3329 3.28665V11.3799C29.3329 11.7221 29.0552 11.9998 28.7129 11.9998ZM28.7129 14.6665C30.5279 14.6665 31.9995 13.1949 31.9995 11.3799V3.28665C31.9995 1.47163 30.5279 3.05176e-05 28.7129 3.05176e-05H3.28528C1.47024 3.05176e-05 0 1.47166 0 3.28665V11.3799C0 13.1948 1.47024 14.6665 3.28528 14.6665H28.7129Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.99927 6.66663H6.66589V4H3.99927V6.66663Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.99927 10.6666H6.66589V7.99994H3.99927V10.6666Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.99927 6.66663H10.6659V4H7.99927V6.66663Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.99927 10.6666H10.6659V7.99994H7.99927V10.6666Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.9993 6.66663H14.6659V4H11.9993V6.66663Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.9993 10.6666H14.6659V7.99994H11.9993V10.6666Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M19.999 6.66663H22.6656V4H19.999V6.66663Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M19.999 10.6666H22.6656V7.99994H19.999V10.6666Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M23.999 6.66663H26.6656V4H23.999V6.66663Z"
            fill="white"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M23.999 10.6666H26.6656V7.99994H23.999V10.6666Z"
            fill="white"
        />
    </svg>, 'HYPERX-RAM', MINING_RAMS.map(q => q.item)]
}

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class MiningComponent extends Component<{}, {
    /** Определяет статус отображения. Полезно если для отображения компонента необходимо не только его включить, а так же и получить какие то данные от клиента или сервера */
    show: boolean,
    /** Пример каких либо данных */
    id: number,
    upgradeMenu?:boolean;
    upgradeComponent?:keyof typeof upgradeNames;
    upgradeComponentRender?:{key: keyof typeof stats, val: number}[];
    items: [number, number][];
} & MiningHouseItemData> {
    /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
    private ev: CustomEventHandler;

    constructor(props: any) {
        super(props);
        this.state = {
            items: [],
            ...MiningHouseDefault,
            /** По умолчанию используется значение CEF.test. true будет если мы в браузере проверяем интерфейс.*/
            show: CEF.test,
            id: 10
        }
        if(CEF.test){}
        this.state = {...this.state, ...MiningHouseDefault}
        // Если необходимо - можно объявить ивент для получения данных от клиента или сервера.
        this.ev = CustomEvent.register('mining:data', (id: number, data: MiningHouseItemData) => {
            this.setState({
                id: id,
                ...data,
                show: true,
            })
        })

    }

    componentWillUnmount() {
        // Удаляем ивент при выгрузке компонента, при новом вызове этого компонента ивент будет создан повторно
        if (this.ev) this.ev.destroy()
    }

    get farmData(){
        return calculateMiningFarmData(this.state)
    }

    upgradeDataRender(data: {key: keyof typeof stats, val: number}[]){
        this.setState({upgradeComponentRender: data || []})
    }



    getComponentList(part: keyof typeof upgradeNames){
        if(part === 'videocards') return this.state.cards;
        if(part === 'cpu') return this.state.cpu;
        if(part === 'powers') return this.state.powers;
        if(part === 'rams') return this.state.ram;
        if(part === 'alghoritm') return this.state.algorithm;
    }

    get cfg(){
        if(!this.state.id) return;
        return getMiningLevel(this.state.level)
    }

    get nextcfg(){
        const cfg = this.cfg;
        if(!cfg) return null;
        if(!cfg.next) return null;
        return getMiningLevel(cfg.next)
    }

    openUpgrade(part: keyof typeof upgradeNames){
        this.setState({upgradeComponent: part})
    }

    get countUpgradeComponents(){
        const part = this.state.upgradeComponent;
        if(part === 'videocards') return this.cfg.max_cards;
        if(part === 'cpu') return 1;
        if(part === 'powers') return this.cfg.max_additional_power_blocks;
        if(part === 'rams') return this.cfg.max_ram_count;
        if(part === 'alghoritm') return 1;
    }

    get emptySlot(){
        return <div className="circle-item empty">
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    opacity="0.2"
                    x="1"
                    y="0.999969"
                    width="30"
                    height="30"
                    rx="15"
                    stroke="white"
                    stroke-width="2"
                    stroke-dasharray="4 4"
                />
            </svg>
        </div>
    }

    get emptyUpgradeSlot(){
        return <div className="circle-item empty">
            <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    opacity="0.2"
                    x="1"
                    y="1"
                    width="62"
                    height="62"
                    rx="31"
                    stroke="white"
                    stroke-width="2"
                    stroke-dasharray="4 4"
                />
            </svg>
        </div>
    }

    render() {
        // Пока мы не получили данные через ивент (либо мы не тестируем интерфейс через браузер) мы не будем отображать интерфейс
        if (!this.state.show) return <></>;
        // Тут уже идёт return самого интерфейса (с примером некоторых данных об игроке, которые уже хранятся в интерфейсах без необходимости их дополнительного получения через ивенты)
        return <SocketSync path={`mining_${this.state.id}`} data={e => {
            if (!e || !this.state.id) return CEF.gui.setGui(null);
            const data = JSON.parse(e);
            this.setState({
                ...data,
                show: true,
            })
        }}>
            <div className="backdrop">
                <div className="modal animated fadeIn" style={{opacity: 0}}>
                    <button className="close-modal" onClick={e => {
                        e.preventDefault()
                        CEF.gui.setGui(null);
                    }}>
                        <div className="icon">
                            <img src={svg['close']} alt=""/>
                        </div>
                        <span>Закрыть</span>
                    </button>
                    <div className="modal-content">
                        <div className="info-block">
                            <div className="modal-title title-xl">
                                Майнинг <br/>
                                ферма
                            </div>
                            <div className="info-content">
                                <div className="level-info">
                                    <div className="level-img">
                                        <img src={png['RTX-3080-large']}/>
                                    </div>
                                    <p className="level title-l">{this.state.level} уровень</p>
                                    {this.nextcfg ? <button className="btn green" onClick={e => {
                                        e.preventDefault()
                                        this.setState({upgradeMenu: !this.state.upgradeMenu})
                                    }}>
                                        <img className="btn-icon up-icon" src={svg['up']}/>
                                        <span>Улучшить</span>
                                    </button> : <></>}
                                </div>
                                <div className="scroll">
                                    {this.state.upgradeMenu ? <>
                                        <div className="info-title">улучшение</div>
                                        <div className={"improvement animated "+(this.state.upgradeMenu ? 'flipInX' : 'flipOutX')} style={{height: this.state.upgradeMenu ? 'auto' : 0}}>
                                            <div className="title-m">
                                                Улучшить ферму <br/>
                                                до {this.nextcfg.id} уровня за ${system.numberFormat(this.nextcfg.requireMoney)}?
                                            </div>
                                            <div className="improvement-btns">
                                                <button className="btn green" onClick={e => {
                                                    e.preventDefault()
                                                    this.setState({upgradeMenu: false})
                                                    CustomEvent.triggerServer('mining:update', this.state.id);
                                                }}>
                                                    <img
                                                        className="btn-icon checkmark-icon"
                                                        src={svg['checkmark']}
                                                        alt=""
                                                    />
                                                    <span>Подтвердить</span>
                                                </button>
                                                <button className="btn purple"  onClick={e => {
                                                    e.preventDefault()
                                                    this.setState({upgradeMenu: false})
                                                }}>
                                                    <span>Отмена</span>
                                                </button>
                                            </div>
                                        </div>

                                    </> : <></>}
                                    <div className="info-title">информация о ферме</div>
                                    <div className="stats">
                                        {Object.keys(stats).map((key, i) => {
                                            let [name, prefix]: [string, string] = (stats as any)[key];
                                            let val: number | {current: number, max: number} = (this.farmData as any)[key]
                                            return <div className="stats-item" key={`mining_stat_${key}`}>
                                                <div className="stats-name">{name}</div>
                                                <div className="stats-value-wrapper">
                                                    <div className="stats-value title-m">{typeof val != "object" ? <>{val || 0}{prefix}</> : <>{val.current || 0}{prefix} / {val.max || 0}{prefix}</>}</div>
                                                    {/*<div className="stats-increase-value title-m">+80{prefix}</div>*/}
                                                </div>
                                                {i === 0 ? (<button className="btn purple" onClick={e => {
                                                    e.preventDefault()
                                                    CustomEvent.triggerServer('mining:sell')
                                                }}>Вывести</button>) : <></>}
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!this.state.upgradeComponent ? <div className="upgrade-block animated fadeIn"  style={{opacity: 0}}>
                            <div className="tile horizontal" id="tile-1" onClick={e => {
                                e.preventDefault()
                                this.openUpgrade('videocards')
                            }}>
                                <div className="title-m">
                                    <p>Видеокарты</p>
                                    <div className="title-icon">
                                        {upgradeNames.videocards[1]}
                                    </div>
                                </div>
                                <div className="tile-content">
                                    {[...new Array(this.cfg.max_cards)].map((_,i) => {
                                        if(this.state.cards[i]) return <div className="circle-item">
                                            <img src={iconsItems[`Item_${this.state.cards[i]}`]}/>
                                        </div>
                                        else return this.emptySlot
                                    })}
                                </div>
                            </div>
                            <div className="tile vertical" id="tile-2"  onClick={e => {
                                e.preventDefault()
                                this.openUpgrade('cpu')
                            }}>
                                <div className="title-m">
                                    <p>Процессор</p>
                                    <div className="title-icon">
                                        {upgradeNames.cpu[1]}
                                    </div>
                                </div>
                            </div>
                            <div className="tile horizontal" id="tile-3"  onClick={e => {
                                e.preventDefault()
                                this.openUpgrade('powers')
                            }}>
                                <div className="title-m">
                                    <p>Блоки питания</p>
                                    <div className="title-icon">
                                        {upgradeNames.powers[1]}
                                    </div>
                                </div>
                                <div className="tile-content">
                                    {[...new Array(this.cfg.max_additional_power_blocks)].map((_,i) => {
                                        if(this.state.powers[i]) return <div className="circle-item">
                                            <img src={iconsItems[`Item_${this.state.powers[i]}`]}/>
                                        </div>
                                        else return this.emptySlot
                                    })}
                                </div>
                            </div>
                            <div className="tile vertical" id="tile-4"  onClick={e => {
                                e.preventDefault()
                                this.openUpgrade('alghoritm')
                            }}>
                                <div className="title-m">
                                    <p>Програмное обеспечение</p>
                                    <div className="title-icon">
                                        {upgradeNames.alghoritm[1]}
                                    </div>
                                </div>
                            </div>
                            <div className="tile horizontal" id="tile-5"  onClick={e => {
                                e.preventDefault()
                                this.openUpgrade('rams')
                            }}>
                                <div className="title-m">
                                    <p>Оперативная память</p>
                                    <div className="title-icon">
                                        {upgradeNames.rams[1]}
                                    </div>
                                </div>
                                <div className="tile-content">
                                    {[...new Array(this.cfg.max_ram_count)].map((_,i) => {
                                        if(this.state.ram[i]) return <div className="circle-item">
                                            <img src={iconsItems[`Item_${this.state.ram[i]}`]}/>
                                        </div>
                                        else return this.emptySlot
                                    })}
                                </div>
                            </div>
                        </div> : <div className="upgrade animated fadeIn"  style={{opacity: 0}}>
                            <button className="back" onClick={e => {
                                e.preventDefault()
                                this.setState({upgradeComponent: null})
                            }}>
                                <img className="back-icon" src={svg['back']}/>
                                <span>Назад</span>
                            </button>
                            <div className="title-m upgrade-title">
                                {(upgradeNames as any)[this.state.upgradeComponent][1]}
                                {(upgradeNames as any)[this.state.upgradeComponent][0]}
                            </div>
                            <div className="circles-row">

                                {[...new Array(this.countUpgradeComponents)].map((_,i) => {
                                    let data = this.getComponentList(this.state.upgradeComponent)
                                    let itemid = null;
                                    if (data)
                                        itemid = typeof data == 'object' ? data[i] : data
                                    if(itemid) return <div className="circle-wrapper" key={'qweeee_'+i}>
                                        <div className="circle-item">
                                            <img src={iconsItems[`Item_${itemid}`]}/>
                                        </div>
                                        <button className="btn-round remove" onClick={e => {
                                            e.preventDefault();
                                            CustomEvent.triggerServer('mining:component:remove', this.state.id, this.state.upgradeComponent, i);
                                        }}>
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <circle cx="12" cy="12" r="12" fill="white"/>
                                                <path
                                                    d="M11.0001 13L13.0001 13H19V11H13.0001L11.0001 11H5V13H11.0001Z"
                                                    fill="#8343EB"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    else return <div className="circle-wrapper" key={'qweeee_'+i}>{this.emptyUpgradeSlot}</div>
                                })}
                            </div>
                            <div className="info-title left">компоненты в инвентаре</div>
                            <div className="inventory">
                                {[...new Array(18 * 2)].map((_, i) => {
                                    // console.log(i)
                                    const itemsCheck = (upgradeNames as any)[this.state.upgradeComponent][3] as number[]
                                    const items = this.state.items.filter(q => itemsCheck.includes(q[1]));
                                    if(items[i]) return <div className="cell" key={`upgrade_my_${i}`}>
                                        <img src={iconsItems[`Item_${items[i][1]}`]}/>
                                        <button className="btn-round add" onClick={e => {
                                            e.preventDefault();
                                            CustomEvent.triggerServer('mining:component:insert', this.state.id, this.state.upgradeComponent, items[i][0]);
                                        }}>
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <circle cx="12" cy="12" r="12" fill="white"/>
                                                <path
                                                    d="M11.0001 13V19H13.0001V13H19V11H13.0001V5.00002L11.0001 5.00002V11H5V13H11.0001Z"
                                                    fill="#8343EB"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    else return <div className="cell" key={`upgrade_my_${i}`} />
                                })}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </SocketSync>;
    }
}
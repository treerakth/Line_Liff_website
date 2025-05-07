// utils/alert.js
import Swal from 'sweetalert2';
// ฟังก์ชันแสดงการแจ้งเตือนสำเร็จ
export const showSuccessAlert = (title, text, redirectUrl = '') => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        confirmButtonText: 'ปิดหน้าต่างนี้',
        confirmButtonColor: '#3b82f6',
        customClass: {
            popup: 'sweet-font'
        }
    })
        .then((result) => {
            if (result.isConfirmed) {
                // ถ้ามี URL ให้ทำการ redirect ไปยังหน้าที่กำหนด
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            }
        });
};
export const showAlreadyAlert = (title, text, redirectUrl = '') => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        confirmButtonText: 'ปิดหน้าต่างนี้',
        confirmButtonColor: '#3b82f6',
        customClass: {
            popup: 'sweet-font'
        }
    })
        .then((result) => {
            if (result.isConfirmed) {
                // ถ้ามี URL ให้ทำการ redirect ไปยังหน้าที่กำหนด
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            }
        });
};

// ฟังก์ชันแสดงการแจ้งเตือนข้อผิดพลาด
export const showErrorAlert = (title, text, redirectUrl = '') => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f44336',
    })
    // .then((result) => {
    //     if (result.isConfirmed) {
    //         // ถ้ามี URL ให้ทำการ redirect ไปยังหน้าที่กำหนด
    //         if (redirectUrl) {
    //             window.location.href = redirectUrl;
    //         }
    //     }
    // });
};

// ฟังก์ชันแสดงการแจ้งเตือนข้อมูล
export const showInfoAlert = (title, text, redirectUrl = '') => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'info',
        confirmButtonText: 'ปิดหน้าต่างนี้',
        confirmButtonColor: '#3b82f6',
    })
    // .then((result) => {
    //     if (result.isConfirmed) {
    //         // ถ้ามี URL ให้ทำการ redirect ไปยังหน้าที่กำหนด
    //         if (redirectUrl) {
    //             window.location.href = redirectUrl;
    //         }
    //     }
    // });
};
export const showSuccessCopy = (title, text) => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        confirmButtonText: 'ปิดหน้าต่างนี้',
        confirmButtonColor: '#3b82f6',
    })
};

export const showErrorCopy = (title, text) => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'error',
        confirmButtonText: 'ปิดหน้าต่างนี้',
        confirmButtonColor: '#f44336',
    })
};

export const showWarningCopy = (title, text) => {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'warning',

    })
}

export const showAlertLogout = () => {
    return Swal.fire({
        title: "ออกจากระบบ?",
        text: "ถ้าคุณออกจากระบบ จำเป็นต้องเข้าสู่ระบบใหม่!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "ออกจากระบบ!",
                text: "ทำการออกจากระบบ.",
                icon: "success"
            });
        }
    });
}
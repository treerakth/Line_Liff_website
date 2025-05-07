'use client';

import React, { useEffect, useState } from 'react';
import { initializeLiff } from '@/utils/liff';
import QRCode from 'qrcode';
import Swal from 'sweetalert2';

const RegisterPage = () => {
    const [profile, setProfile] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [cooldown, setCooldown] = useState(0); // ตัวแปรสำหรับนับเวลาถอยหลัง

    useEffect(() => {
        const getProfile = async () => {
            try {
                const liffInstance = await initializeLiff();
                const userProfile = await liffInstance.getProfile();
                setProfile(userProfile);
            } catch (error) {
                console.error('Error getting LIFF profile:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to get user profile from LIFF',
                    icon: 'error',
                });
            }
        };

        getProfile();
    }, []);

    // นับถอยหลังทุก 1 วินาที
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const generateQRCode = async () => {
        if (!profile?.userId) {
            Swal.fire({
                title: 'Error',
                text: 'User ID is not available',
                icon: 'error',
            });
            return;
        }

        try {
            const dataUrl = await QRCode.toDataURL(profile.userId, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            setQrCodeUrl(dataUrl);
            setCooldown(20); // เริ่มนับถอยหลัง 20 วินาที
        } catch (err) {
            console.error('QR Code generation failed:', err);
            Swal.fire({
                title: 'Error',
                text: 'QR Code generation failed',
                icon: 'error',
            });
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 text-black">
            <h1 className="text-2xl text-center font-bold mb-4">ทดสอบ สร้าง QR Code</h1>
            <h2 className="text-2xl text-center font-bold mb-4">ด้วย Line UserId</h2>

            {profile && (
                <div className="mb-4 text-center">
                    <p><strong>Name:</strong> {profile.displayName}</p>
                    <p><strong>User ID:</strong> {profile.userId}</p>
                    {profile.state && <p><strong>State Liff:</strong> {profile.state}</p>}
                </div>
            )}

            <button
                onClick={generateQRCode}
                disabled={cooldown > 0}
                className={`px-6 py-2 rounded-lg transition mb-6 ${cooldown > 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
            >
                {cooldown > 0 ? `Please wait ${cooldown}s` : 'Generate QR Code'}
            </button>

            {qrCodeUrl && (
                <div className="relative bg-white p-4 rounded shadow w-[300px] h-[300px]">
                    <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className={`w-full h-full object-contain transition duration-300 rounded ${cooldown === 0 ? 'blur-sm brightness-75' : ''
                            }`}
                    />

                    {cooldown === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-60 text-white text-center px-4 py-2 rounded text-lg">
                                กรุณาทำรายการใหม่
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
};

export default RegisterPage;

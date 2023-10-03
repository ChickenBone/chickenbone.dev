'use client'

import { Dropdown } from '@nextui-org/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';



export default function RFM69() {

    return (
        <div className={'w-full h-full'}>
            <div className='col-span-1 md:col-span-2 place-self-start my-24'>
                <h1 className='text-4xl font-bold text-center'>RFM69 Research for Flipper Zero</h1>
                <h2>May come back to this may not</h2>
                <p>
                    RFM 69 Modulation GFSK_Rb250Fd250
                    <br />
                    RFM 69 Frequency 915.0 MHz (US)
                    <br />
                    RFM 69 Bit Rate 250 kbps
                    <br />
                    RFM 69 Deviation 250 kHz
                    <br />
                    RFM 69 RX Bandwidth 500 kHz
                    <br />
                    RFM 69 TX Power 13 dBm (Low Power)
                    <br />
                    RFM 69 Sensitivity -120 dBm (Low Power)
                    <br />
                    RFM 69 Packet Format Variable Length
                    <br />
                    RFM 69 Baud Rate 250 kbps
                    <a href="https://github.com/antirez/protoview/blob/main/custom_presets.h#L113" target="_blank">
                        Source Code
                    </a>

                    <h2>Example GFSK CONFIG for RFM69 and Flipper Zero</h2>
                    <p>
                        GPIO GD0
                        <br />
                        {`{CC1101_IOCFG0, 0x0D}, // GD0 as async serial data output/input`}
                        <br />
                        <br />
                        Frequency Synthesizer Control
                        <br />
                        {`{CC1101_FSCTRL1, 0x06}, // IF = (26*10^6) / (2^10) * 0x06 = 152343.75Hz`}
                        <br />
                        <br />
                        Packet engine
                        <br />
                        {`{CC1101_PKTCTRL0, 0x32}, // Async, continious, no whitening`}
                        {`{CC1101_PKTCTRL1, 0x04},`}
                        <br />
                        <br />
                        Modem Configuration
                        <br />
                        {`{CC1101_MDMCFG0, 0x00},`}
                        {`{CC1101_MDMCFG1, 0x02}, // 2 is the channel spacing exponet: not used`}
                        {`{CC1101_MDMCFG2, 0x10}, // GFSK without any other check`}
                        {`{CC1101_MDMCFG3, 0x93}, // Data rate is 20kBaud`}
                        {`{CC1101_MDMCFG4, 0x59}, // Rx bandwidth filter is 325 kHz`}
                        {`{CC1101_DEVIATN, 0x34}, // Deviation 19.04 Khz.`}
                        <br />
                        <br />
                        Main Radio Control State Machine
                        <br />
                        {`{CC1101_MCSM0, 0x18}, // Autocalibrate on idle-to-rx/tx, PO_TIMEOUT is 64 cycles(149-155us)`}
                        <br />
                        Frequency Offset Compensation Configuration
                        <br />
                        {`{CC1101_FOCCFG, 0x16}, // no frequency offset compensation, POST_K same as PRE_K, PRE_K is 4K, GATE is off`}
                        <br />
                        <br />
                        Automatic Gain Control
                        <br />
                        {`{CC1101_AGCCTRL0, 0x80},`}
                        {`{CC1101_AGCCTRL1, 0x58},`}
                        {`{CC1101_AGCCTRL2, 0x87},`}
                        <br />
                        <br />
                        Wake on radio and timeouts control
                        <br />
                        {`{CC1101_WORCTRL, 0xFB}, // WOR_RES is 2^15 periods (0.91 - 0.94 s) 16.5 - 17.2 hours`}
                        <br />
                        <br />
                        Frontend configuration
                        <br />
                        {`{CC1101_FREND0, 0x10}, // Adjusts current TX LO buffer`}
                        {`{CC1101_FREND1, 0x56},`}
                        <br />
                        <br />
                        End
                        <br />
                        {`{0, 0},`}
                        <br />
                        <br />
                        CC1101 2FSK PATABLE.
                        <br />
                        {`{0xC0, 0}, {0,0}, {0,0}, {0,0}`}
                        <br />
                        <br />
                    </p>
                </p>
            </div>
        </div>


    )
}

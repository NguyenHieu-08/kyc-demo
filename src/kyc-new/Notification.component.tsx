import React, {forwardRef, useMemo, useRef, useImperativeHandle} from 'react';
import GenericAccordion, {AccordionHandle, AccordionItem, AccordionSection} from "./generate-accordion-section";
import {useSelector} from "react-redux";

export interface Notification extends AccordionSection {
    label: string;
    data: Array<AccordionItem>;
}

interface PropsModal {
    isFormEditable?: boolean;
    isView?: boolean;
}

const NotificationMethod = forwardRef((props: PropsModal, ref: any) => {
        const {isFormEditable = false} = props;
        const accordionRef = useRef(null);
        // Chỉ subscribe vào notificationMethods, không subscribe vào toàn bộ state.kyc
        const notificationMethods = useSelector((state: any) => state.kyc.notificationMethods);

        useImperativeHandle(ref, () => ({
            // Chuẩn hóa API: dùng lại đúng các method từ GenericAccordion
            getData: () => (accordionRef.current as any)?.getData() || [],
            getOpenSections: () => (accordionRef.current as any)?.getOpenSections() || {},
        }));

        // Memoize sections để tránh tạo array mới mỗi lần render
        const sections = useMemo(() => {
            return notificationMethods || [];
        }, [notificationMethods]);

        // Memoize config để tránh tạo object mới mỗi lần render
        const config = useMemo(() => ({
            multipleOpen: false, // Single section mode
            autoOpenSelected: true,
            persistOpenState: true,
        }), []);

        const AccordionComponent = GenericAccordion as any;
        return (
            <AccordionComponent
                ref={accordionRef}
                sections={sections}
                config={config}
            />
        );
    }
);

NotificationMethod.displayName = 'NotificationMethod';

export default React.memo(NotificationMethod);
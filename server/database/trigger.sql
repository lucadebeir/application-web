CREATE OR REPLACE FUNCTION deleteNotification() RETURNS trigger
    AS deleteNotification
BEGIN
    Delete from notifications when DATE(notifications.dateNotification) < (NOW() - INTERVAL 30 DAY)
END;
deleteNotification;

CREATE  OR REPLACE TRIGGER deleteNotification AFTER INSERT ON notifications 
    FOR EACH ROW EXECUTE PROCEDURE deleteNotification();

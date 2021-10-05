docker-compose down
docker-compose build
docker-compose up -d etherpad mariadb

# Get line of API_KEY and delete from env file
FILE=APIKEY.txt

sed '/API_KEY=/d' .env >.new
rm .env
mv .new .env
rm $FILE 2> /dev/null

# Get APIKEY from etherpad container
while [ ! -f $FILE ]; do
    if docker cp etherpad://opt/etherpad-lite/APIKEY.txt . 2> /dev/null ; then
        echo "APIKEY got from etherpad container"
    else
        sleep 2
    fi
done

# Set value into env file
echo "API_KEY=$(cat $FILE)" >>.env
rm $FILE

# Start react and nginx containers
docker-compose up
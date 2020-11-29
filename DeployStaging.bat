cd StreamingLiveAdmin
call SET REACT_APP_STAGE=staging&& npm run build
call aws s3 sync build/ s3://staging-streaminglive-admin
call aws cloudfront create-invalidation --distribution-id E3SMEG3Q7CJ1B9 --paths /*
cd ..

cd StreamingLiveApi
call npm run deploy-staging
cd ..

cd StreamingLiveChat
call npm run deploy-staging
cd ..

cd StreamingLiveSub
call SET REACT_APP_STAGE=staging&& npm run build
call aws s3 sync build/ s3://staging-streaminglive-sub
call aws cloudfront create-invalidation --distribution-id E2CBYEJ9SM6ZSJ --paths /*
cd ..

cd StreamingLiveWeb
call export REACT_APP_STAGE=staging&& npm run build
call aws s3 sync build/ s3://staging-streaminglive-web
call aws cloudfront create-invalidation --distribution-id EZS5Z2QZNKQU7 --paths /*
cd ..

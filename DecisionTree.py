from sklearn import tree
import TFLoadData

data, target = TFLoadData.loadDataSetWOOneHotEncoding(50)
data_test, target_test = TFLoadData.loadDataSetWOOneHotEncoding(1000)


clf = tree.DecisionTreeClassifier()
   
while len(data) >= 50:
    clf = clf.fit(data, target)
    break
#print(clf.score(data_test,target_test))
#print(clf.predict(data_test, target_test))
#print(target_test)
#print(clf.get_params(deep=True))


j = {"x":[3]}

print(clf.predict([j["x"]]))

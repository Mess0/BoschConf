import numpy as np

def loadDataSet(n):
    
    xs = [[np.random.random()*100] for x in range(100)]
    ys = [[0,1] if x[0] < 100 else [1,0] for x in xs]

    return xs, ys

def loadDataSetWOOneHotEncoding(n):
    
    xs = [[np.random.random()*100] for x in range(100)]
    ys = [[0] if x[0] < 100 else [1] for x in xs]

    return xs, ys
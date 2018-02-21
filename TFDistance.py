import tensorflow as tf
import numpy as np 
import time
import os
from sklearn.metrics import classification_report
import LoadDatasetArray
from shutil import copyfile
import TFLoadData

sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))

def weight_variable(shape):

    initial = tf.truncated_normal(shape, stddev=0.1)
    return tf.Variable(initial)

def bias_variable(shape):
   
    initial = tf.constant(0.1, shape=shape)
    return tf.Variable(initial)


sess = tf.InteractiveSession() 

x_array = tf.placeholder(tf.float32, shape=(None ,1), name = "x")
y = tf.placeholder(tf.float32, shape=(None,2), name = "y")

# Dimensions
# Input tensor shape: [batch, in_height, in_width, in_channels] 
# Filter/kernel shape: [filter_height, filter_width, in_channels, out_channels]

with tf.name_scope('fc1'):
    
    weights_fc1 = weight_variable([1, 1024])
    b_fc1 = bias_variable([1024])
    fc1 = tf.matmul(x_array, weights_fc1) + b_fc1
    h_fc1 = tf.nn.relu(fc1)


with tf.name_scope('fc2'):
    
    weights_fc2 = weight_variable([1024, 200])
    b_fc2 = bias_variable([200])
    h_fc1_flat = tf.reshape(h_fc1, [-1, 1024])
    fc2 = tf.matmul(h_fc1_flat, weights_fc2) + b_fc2
    h_fc2 = tf.nn.relu(fc2)

with tf.name_scope('fc3'):

    weights_fc3 = weight_variable([200, 2])
    b_fc3 = bias_variable([2])
    fc3 = tf.matmul(h_fc2, weights_fc3) + b_fc3

prediction = tf.nn.softmax(fc3 , name = "prediction")

with tf.name_scope('cross_entropy'):
    
    cross_entropy = tf.nn.softmax_cross_entropy_with_logits(labels=y,
                                                            logits=fc3)
    cross_entropy = tf.reduce_mean(cross_entropy)

    cross_entropy = tf.Print(cross_entropy,[cross_entropy], "'''")

with tf.name_scope('optimization'):

    with tf.control_dependencies([tf.Print(cross_entropy, [cross_entropy], "\n###")]):
        
        train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)

with tf.name_scope('accuracy'):
    correct_prediction = tf.equal(tf.argmax(fc3, 1), tf.argmax(y, 1))
    correct_prediction = tf.cast(correct_prediction, tf.float32)
    accuracy = tf.reduce_mean(correct_prediction, name = "accuracy")
    #tf.metrics.accuracy()

# Save & restore model
saver = tf.train.Saver(max_to_keep=1,  keep_checkpoint_every_n_hours=1)

# Tensorboard log/summary writer
project_path = "D:/TensorFlowTemp/woconvolution"
model_no = str(int(time.time()))

graphSummary_path = os.path.join(project_path, "Graph&Summaries",model_no)

os.makedirs(graphSummary_path)
train_writer = tf.summary.FileWriter(logdir=graphSummary_path + "/train", graph = tf.get_default_graph())
test_writer = tf.summary.FileWriter(logdir=graphSummary_path + "/test")

trained_model = "{0}.ckpt".format(model_no)
trained_path = os.path.join(project_path, "TrainedModels", trained_model)

# Save script
scriptBackupPath = os.path.join(project_path,"PythonScripts", model_no + ".py")
copyfile(__file__, scriptBackupPath)

# Dynamic logs
tf.summary.scalar("cross_entropy", cross_entropy)
tf.summary.scalar("accuracy", accuracy)
summary_op = tf.summary.merge_all()

# Initialize all variables (except placeholders)
init_op = tf.global_variables_initializer()
sess.run(init_op)

# Test Data
test_data, test_y_ = TFLoadData.loadDataSet(1000)

# Train data
data, y_ = TFLoadData.loadDataSet(20000)

#test_data = test_data.reshape(-1,1,3000,3)

# Replace by tensorboard logs
train_accuracy = []
test_accuracy = []

for step in range(5000):
    
        
    _, r_accuracy, r_summary = sess.run([train_step, accuracy, summary_op ], feed_dict = {x_array:data, y:y_})
  
    
    train_writer.add_summary(r_summary, step)
    train_accuracy.append(r_accuracy)
    
    if step%20 == 0:
        
        r_accuracy, r_summary = sess.run([accuracy, summary_op], feed_dict = {x_array:test_data, y:test_y_})
        test_writer.add_summary(r_summary, step)
        

        save_path = saver.save(sess,trained_path)

train_writer.close()
test_writer.close()

